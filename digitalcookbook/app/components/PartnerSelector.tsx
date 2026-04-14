"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import InfoCard from "@/app/components/infocard";
import { uploadImage } from "@/lib/uploadImage";

export default function PartnerSelector() {
    const [partners, setPartners] = useState<any[]>([]);
    const [modalPartner, setModalPartner] = useState<any | null>(null);
    const [pendingImage, setPendingImage] = useState<{url: string, public_id: string} | null>(null);
    const [oldImagePublicID, setOldImagePublicID] = useState<string | null>(null);
    
    // Get partners
    useEffect(() => {
        fetch("/api/partners")
            .then(res => res.json())
            .then(data => setPartners(data))
            .catch(error => console.warn(`Failed to fetch partners API: ${error}`));
    }, []);

    const refreshPartners = async () => {
        await fetch("/api/partners")
        .then(res => res.json())
        .then(data => setPartners(data));
    };

    return (
        <>
            <div className="p-6 max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Community Partners</h2>

                    <button className="btn btn-success" onClick={() => setModalPartner({ title: { en: "", es: "" }, description: { en: "", es: "" }, link: "", order: partners.length, imageURI: "", public_id: "" })}>
                        + Add New Partner
                    </button>
                </div>

                {/* List Partners */}
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {partners.map(partner => (
                        <InfoCard
                            key={partner._id}
                            title={partner.title.en}
                            description=""
                            href="#"
                            imageSrc={partner?.imageURI ?? ""}
                            action={
                                <button className="btn btn-primary btn-sm"
                                    onClick={() => {
                                        setModalPartner({...partner});
                                        setOldImagePublicID(partner.public_id || null);
                                        setPendingImage(null);
                                    }}
                                >
                                    Edit
                                </button>
                            }
                        />
                    ))}
                </ul>
            </div>

            {/* Modal */}
            {modalPartner && (
            <dialog
                className="modal modal-open"
                onClick={async () => {
                    if(pendingImage?.public_id) {
                        await uploadImage(undefined, pendingImage.public_id);
                    }

                    setPendingImage(null);
                    setOldImagePublicID(null);
                    setModalPartner(null);
                }}
            >
                <form
                    className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        
                        await fetch("/api/partners", {
                            method: modalPartner._id ? "PUT" : "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                _id: modalPartner._id,
                                title: modalPartner.title,
                                description: modalPartner.description,
                                link: modalPartner.link,
                                order: partners.length,
                                imageURI: pendingImage?.url ?? modalPartner.imageURI,
                                public_id: pendingImage?.public_id ?? modalPartner.public_id
                            })
                        });

                        if (oldImagePublicID && oldImagePublicID !== (pendingImage?.public_id ?? modalPartner.public_id)) {
                            await uploadImage(undefined, oldImagePublicID);
                        }

                        setPendingImage(null);
                        setOldImagePublicID(null);
                        setModalPartner(null);
                        refreshPartners();

                    }}
                >
                    <h3 className="font-bold text-2xl mb-6">
                        {modalPartner._id ? "Edit Resource" : "Add Resource"}
                    </h3>

                    {/* Name */}
                    <label className="font-semibold" htmlFor="nameENInput">Title en: </label>
                    <input id="nameENInput" className="input input-bordered w-full mb-4"
                        value={modalPartner.title.en || ""} 
                        onChange={e => setModalPartner({ ...modalPartner, title: { ...modalPartner.title, en: e.target.value } })}
                        required 
                    />

                    <label className="font-semibold" htmlFor="nameESInput">Title es: </label>
                    <input id="nameESInput" className="input input-bordered w-full mb-4"
                        value={modalPartner.title.es || ""} 
                        onChange={e => setModalPartner({ ...modalPartner, title: { ...modalPartner.title, es: e.target.value } })}
                        required 
                    />

                    {/* image */}
                    <label className="font-semibold" htmlFor="imageInput">Upload Image: </label>
                    <input id="imageInput" className="file-input file-input-bordered w-full mb-4"
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if(!file)
                                return;
                            const res = await uploadImage(file);
                            if(!res?.url)
                                return;

                            if (pendingImage?.public_id) {
                                await uploadImage(undefined, pendingImage.public_id);
                            }

                            setPendingImage({url: res.url, public_id: res.public_id});
                            setModalPartner((prev: any) => ({...prev, imageURI: res.url, public_id: res.public_id}));
                        }}
                    />

                    {/* image preview */}
                    {(pendingImage?.url || modalPartner.imageURI) && (
                        <div className="mt-2 relative w-full h-40">
                            <Image
                                src={(pendingImage?.url || modalPartner.imageURI)}
                                alt="Preview"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="object-contain rounded"
                            />
                        </div>
                    )}

                    {/* remove image button */}
                    {(pendingImage?.public_id || modalPartner.public_id) && (
                        <button
                            type="button"
                            className="btn btn-warning mt-3 w-full"
                            onClick={async () => {
                                if (pendingImage?.public_id ?? modalPartner.public_id) {
                                    await uploadImage(undefined, (pendingImage?.public_id ?? modalPartner.public_id));
                                }

                                setPendingImage(null);
                                setModalPartner((prev: any) => ({...prev, imageURI: "", public_id: ""}));
                            }}
                        >
                            Remove Image
                        </button>
                    )}
                
                    {/* description */}
                    <label className="font-semibold" htmlFor="descriptionENInput">Description en: </label>
                    <input id="descriptionENInput" className="input input-bordered w-full mb-4"
                        value={modalPartner.description.en || ""} 
                        onChange={e => setModalPartner({ ...modalPartner, description: { ...modalPartner.description, en: e.target.value } })}
                    />

                    <label className="font-semibold" htmlFor="descriptionESInput">Description es: </label>
                    <input id="descriptionESInput" className="input input-bordered w-full mb-4"
                        value={modalPartner.description.es || ""} 
                        onChange={e => setModalPartner({ ...modalPartner, description: { ...modalPartner.description, es: e.target.value } })}
                    />

                    {/* Link */}
                    <label className="font-semibold" htmlFor="linkInput">Link: </label>
                    <input id="linkInput" className="input input-bordered w-full mb-4"
                        value={modalPartner.link || ""}
                        onChange={e => setModalPartner({ ...modalPartner, link: e.target.value })}
                    />

                    {/* BUTTONS */}
                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            className="btn btn-secondary flex-1"
                            onClick={async () => {
                                if (pendingImage?.public_id) {
                                    await uploadImage(undefined, pendingImage.public_id);
                                }

                                setPendingImage(null);
                                setOldImagePublicID(null);
                                setModalPartner(null);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                        >
                            Save
                        </button>
                        {modalPartner._id && (
                            <button
                                type="button"
                                className="btn btn-error flex-1"
                                onClick={async () => {
                                    if (modalPartner.public_id) {
                                        await uploadImage(undefined, modalPartner.public_id);
                                    }

                                    await fetch(`/api/partners?_id=${modalPartner._id}`, { method: "DELETE" });
                                    setModalPartner(null);
                                    refreshPartners();
                                }}
                            >
                                Remove
                            </button>
                        )}

                    </div>
                </form>
            </dialog>
            )}
        </>
    );
}