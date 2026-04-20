"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import InfoCard from "@/app/components/infocard";
import { uploadImage } from "@/lib/uploadImage";

export default function SafetySelector() {
    const [safeties, setSafety] = useState<any[]>([]);
    const [modalSafety, setModalSafety] = useState<any | null>(null);
    const [pendingImage, setPendingImage] = useState<{url: string, public_id: string} | null>(null);
    const [oldImagePublicID, setOldImagePublicID] = useState<string | null>(null);
         
    // Get safety items
    useEffect(() => {
        fetch("/api/safety")
            .then(res => res.json())
            .then(data => setSafety(data))
            .catch(error => console.warn(`Failed to fetch safety API: ${error}`));
    }, []);

    const refreshSafetyItems = async () => {
        await fetch("/api/safety")
        .then(res => res.json())
        .then(data => setSafety(data));
    };

    return (
        <>
            <div className="p-6 max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Safety</h2>

                    <button className="btn btn-success" onClick={() => setModalSafety({ title: { en: "", es: "" }, description: { en: "", es: "" }, link: "", order: safeties.length, imageURI: "", public_id: "" })}>
                        + Add New Safety Item
                    </button>
                </div>

                {/* List Safety Items */}
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {safeties.map(item => (
                        <InfoCard
                            key={item._id}
                            title={item.title.en}
                            description=""
                            href="#"
                            imageSrc={item?.imageURI ?? ""}
                            action={
                                <button className="btn btn-primary btn-sm" 
                                    onClick={() => {
                                        setModalSafety({...item});
                                        setOldImagePublicID(item.public_id || null);
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
            {modalSafety && (
            <dialog
                className="modal modal-open"
                onClick={async () => {
                    if(pendingImage?.public_id) {
                        await uploadImage(undefined, pendingImage.public_id);
                    }
                    
                    setPendingImage(null);
                    setOldImagePublicID(null);
                    setModalSafety(null);
                }}
            >
                <form
                    className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        
                        await fetch("/api/safety", {
                            method: modalSafety._id ? "PUT" : "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                _id: modalSafety._id,
                                title: modalSafety.title,
                                description: modalSafety.description,
                                link: modalSafety.link,
                                order: safeties.length,
                                imageURI: pendingImage?.url ?? modalSafety.imageURI,
                                public_id: pendingImage?.public_id ?? modalSafety.public_id
                            })
                        });

                        if (oldImagePublicID && oldImagePublicID !== (pendingImage?.public_id ?? modalSafety.public_id)) {
                            await uploadImage(undefined, oldImagePublicID);
                        }

                        setPendingImage(null);
                        setOldImagePublicID(null);
                        setModalSafety(null);
                        refreshSafetyItems();

                    }}
                >
                    <h3 className="font-bold text-2xl mb-6">
                        {modalSafety._id ? "Edit Safety Item" : "Add Safety Item"}
                    </h3>

                    {/* Name */}
                    <label className="font-semibold" htmlFor="nameENInput">Title en: </label>
                    <input id="nameENInput" className="input input-bordered w-full mb-4"
                        value={modalSafety.title.en || ""} 
                        onChange={e => setModalSafety({ ...modalSafety, title: { ...modalSafety.title, en: e.target.value } })}
                        required 
                    />

                    <label className="font-semibold" htmlFor="nameESInput">Title es: </label>
                    <input id="nameESInput" className="input input-bordered w-full mb-4"
                        value={modalSafety.title.es || ""} 
                        onChange={e => setModalSafety({ ...modalSafety, title: { ...modalSafety.title, es: e.target.value } })}
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
                            setModalSafety((prev: any) => ({...prev, imageURI: res.url, public_id: res.public_id}));
                        }}
                    />

                    {/* image preview */}
                    {(pendingImage?.url || modalSafety.imageURI) && (
                        <div className="mt-2 relative w-full h-40">
                            <Image
                                src={(pendingImage?.url || modalSafety.imageURI)}
                                alt="Preview"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="object-contain rounded"
                            />
                        </div>
                    )}

                    {/* remove image button */}
                    {(pendingImage?.public_id || modalSafety.public_id) && (
                        <button
                            type="button"
                            className="btn btn-warning mt-3 w-full"
                            onClick={async () => {
                                if (pendingImage?.public_id ?? modalSafety.public_id) {
                                    await uploadImage(undefined, (pendingImage?.public_id ?? modalSafety.public_id));
                                }

                                setPendingImage(null);
                                setModalSafety((prev: any) => ({...prev, imageURI: "", public_id: ""}));
                            }}
                        >
                            Remove Image
                        </button>
                    )}
                
                    {/* description */}
                    <label className="font-semibold" htmlFor="descriptionENInput">Description en: </label>
                    <input id="descriptionENInput" className="input input-bordered w-full mb-4"
                        value={modalSafety.description.en || ""} 
                        onChange={e => setModalSafety({ ...modalSafety, description: { ...modalSafety.description, en: e.target.value } })}
                    />

                    <label className="font-semibold" htmlFor="descriptionESInput">Description es: </label>
                    <input id="descriptionESInput" className="input input-bordered w-full mb-4"
                        value={modalSafety.description.es || ""} 
                        onChange={e => setModalSafety({ ...modalSafety, description: { ...modalSafety.description, es: e.target.value } })}
                    />

                    {/* Link */}
                    <label className="font-semibold" htmlFor="linkInput">Link: </label>
                    <input id="linkInput" className="input input-bordered w-full mb-4"
                        value={modalSafety.link || ""}
                        onChange={e => setModalSafety({ ...modalSafety, link: e.target.value })}
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
                                setModalSafety(null);
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
                        {modalSafety._id && (
                            <button
                                type="button"
                                className="btn btn-error flex-1"
                                onClick={async () => {
                                    if(modalSafety.public_id) {
                                        await uploadImage(undefined, modalSafety.public_id);
                                    }

                                    await fetch(`/api/safety?_id=${modalSafety._id}`, { method: "DELETE" });
                                    setModalSafety(null);
                                    refreshSafetyItems();
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