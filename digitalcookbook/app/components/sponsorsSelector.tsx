"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import InfoCard from "@/app/components/infocard";
import { uploadImage } from "@/lib/uploadImage";

export default function SponsorsSelector() {
    const [sponsors, setSponsors] = useState<any[]>([]);
    const [modalSponsor, setModalSponsor] = useState<any | null>(null);
    const [pendingImage, setPendingImage] = useState<{url: string, public_id: string} | null>(null);
    const [oldImagePublicID, setOldImagePublicID] = useState<string | null>(null);
    
    // get sponsor data from database
    useEffect(() => {
        fetch("/api/advertisments")
        .then(response => response.json())
        .then(data => {
            // set sponsors
            setSponsors(data.ads || []);

        }).catch(error => console.warn(`Failed to fetch advertisments API: ${error}`)); // catch fetch errors

    }, []);

    const refreshSponsors = async () => {
        await fetch("/api/advertisments")
        .then(res => res.json())
        .then(data => setSponsors(data.ads || []));
    };

    return (
        <>
            <div className="p-6 max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold mr-4">Homepage Partners</h2>

                    <button className="btn btn-success"
                        onClick={() => {
                            setModalSponsor({ name: "", imageURI: "", public_id: "", link: "" });
                            setPendingImage(null);
                            setOldImagePublicID(null);
                        }}
                    >
                        + Add New Partner
                    </button>
                </div>

                {/* List Sponsors */}
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sponsors.map(sponsor => (
                        <InfoCard
                            key={sponsor._id}
                            title={sponsor.name}
                            description=""
                            href="#"
                            imageSrc={sponsor.imageURI.trimEnd()}
                            action={
                                <button className="btn btn-primary btn-sm"
                                    onClick={() => {
                                        setModalSponsor({...sponsor, public_id: sponsor.public_id || ""});
                                        setOldImagePublicID(sponsor.public_id || null);
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
            {modalSponsor && (
            <dialog
                className="modal modal-open"
                onClick={async () => {
                    if(pendingImage?.public_id) {
                        await uploadImage(undefined, pendingImage.public_id);
                    }

                    setPendingImage(null);
                    setOldImagePublicID(null);
                    setModalSponsor(null);
                }}
            >
                <form
                    className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        
                        await fetch("/api/advertisments", {
                            method: modalSponsor._id ? "PUT" : "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                _id: modalSponsor._id,
                                name: modalSponsor.name,
                                imageURI: pendingImage?.url || modalSponsor.imageURI,
                                public_id: pendingImage?.public_id || modalSponsor.public_id,
                                link: modalSponsor.link
                            })
                        });

                        if (oldImagePublicID && oldImagePublicID !== (pendingImage?.public_id || modalSponsor.public_id)) {
                            await uploadImage(undefined, oldImagePublicID);
                        }

                        setPendingImage(null);
                        setOldImagePublicID(null);
                        setModalSponsor(null);
                        refreshSponsors();

                    }}
                >
                    <h3 className="font-bold text-2xl mb-6">
                        {modalSponsor._id ? "Edit Partner" : "Add Partner"}
                    </h3>

                    {/* Name */}
                    <label className="font-semibold" htmlFor="nameInput">Name: </label>
                    <input id="nameInput" className="input input-bordered w-full mb-4"
                        value={modalSponsor.name || ""} 
                        onChange={e => setModalSponsor({ ...modalSponsor, name: e.target.value })}
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
                        }}
                    />

                    {/* image preview */}
                    {(pendingImage?.url || modalSponsor.imageURI) && (
                        <div className="mt-2 relative w-full h-40">
                            <Image
                                src={(pendingImage?.url || modalSponsor.imageURI)}
                                alt="Preview"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="object-contain rounded"
                            />
                        </div>
                    )}

                    {/* Link */}
                    <label className="font-semibold" htmlFor="linkInput">Link: </label>
                    <input id="linkInput" className="input input-bordered w-full mb-4"
                        value={modalSponsor.link || ""}
                        onChange={e => setModalSponsor({ ...modalSponsor, link: e.target.value })}
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
                                setModalSponsor(null);
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
                        {modalSponsor._id && (
                            <button
                                type="button"
                                className="btn btn-error flex-1"
                                onClick={async () => {
                                    const publicID = modalSponsor.public_id;

                                    try {
                                        if(publicID)
                                            await uploadImage(undefined, publicID);

                                        const res = await fetch(`/api/advertisments?_id=${modalSponsor._id}`, { method: "DELETE" });
                                        if(!res.ok) throw new Error("DB delete failed");

                                        setModalSponsor(null);
                                        refreshSponsors();
                                    } catch(err) {
                                        console.error(err);
                                        alert("Failed to delete sponsor");
                                    }
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