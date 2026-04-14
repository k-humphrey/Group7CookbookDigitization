"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import InfoCard from "@/app/components/infocard";
import { uploadImage } from "@/lib/uploadImage";

export default function ResourceSelector() {
    const [resources, setResources] = useState<any[]>([]);
    const [modalResource, setModalResource] = useState<any | null>(null);
    const [pendingImage, setPendingImage] = useState<{url: string, public_id: string} | null>(null);
    const [oldImagePublicID, setOldImagePublicID] = useState<string | null>(null);
         
    // Get resources
    useEffect(() => {
        fetch("/api/resources")
            .then(res => res.json())
            .then(data => setResources(data))
            .catch(error => console.warn(`Failed to fetch resources API: ${error}`));
    }, []);

    const refreshResources = async () => {
        await fetch("/api/resources")
        .then(res => res.json())
        .then(data => setResources(data));
    };

    return (
        <>
            <div className="p-6 max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Community Resources</h2>

                    <button className="btn btn-success" onClick={() => setModalResource({ title: { en: "", es: "" }, description: { en: "", es: "" }, link: "", order: resources.length, imageURI: "", public_id: "" })}>
                        + Add New Resource
                    </button>
                </div>

                {/* List Resources */}
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resources.map(resource => (
                        <InfoCard
                            key={resource._id}
                            title={resource.title.en}
                            description=""
                            href="#"
                            imageSrc={resource?.imageURI ?? ""}
                            action={
                                <button className="btn btn-primary btn-sm" 
                                    onClick={() => {
                                        setModalResource({...resource});
                                        setOldImagePublicID(resource.public_id || null);
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
            {modalResource && (
            <dialog
                className="modal modal-open"
                onClick={async () => {
                    if(pendingImage?.public_id) {
                        await uploadImage(undefined, pendingImage.public_id);
                    }
                    
                    setPendingImage(null);
                    setOldImagePublicID(null);
                    setModalResource(null);
                }}
            >
                <form
                    className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        
                        await fetch("/api/resources", {
                            method: modalResource._id ? "PUT" : "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                _id: modalResource._id,
                                title: modalResource.title,
                                description: modalResource.description,
                                link: modalResource.link,
                                order: resources.length,
                                imageURI: pendingImage?.url ?? modalResource.imageURI,
                                public_id: pendingImage?.public_id ?? modalResource.public_id
                            })
                        });

                        if (oldImagePublicID && oldImagePublicID !== (pendingImage?.public_id ?? modalResource.public_id)) {
                            await uploadImage(undefined, oldImagePublicID);
                        }

                        setPendingImage(null);
                        setOldImagePublicID(null);
                        setModalResource(null);
                        refreshResources();

                    }}
                >
                    <h3 className="font-bold text-2xl mb-6">
                        {modalResource._id ? "Edit Resource" : "Add Resource"}
                    </h3>

                    {/* Name */}
                    <label className="font-semibold" htmlFor="nameENInput">Title en: </label>
                    <input id="nameENInput" className="input input-bordered w-full mb-4"
                        value={modalResource.title.en || ""} 
                        onChange={e => setModalResource({ ...modalResource, title: { ...modalResource.title, en: e.target.value } })}
                        required 
                    />

                    <label className="font-semibold" htmlFor="nameESInput">Title es: </label>
                    <input id="nameESInput" className="input input-bordered w-full mb-4"
                        value={modalResource.title.es || ""} 
                        onChange={e => setModalResource({ ...modalResource, title: { ...modalResource.title, es: e.target.value } })}
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
                            setModalResource((prev: any) => ({...prev, imageURI: res.url, public_id: res.public_id}));
                        }}
                    />

                    {/* image preview */}
                    {(pendingImage?.url || modalResource.imageURI) && (
                        <div className="mt-2 relative w-full h-40">
                            <Image
                                src={(pendingImage?.url || modalResource.imageURI)}
                                alt="Preview"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="object-contain rounded"
                            />
                        </div>
                    )}

                    {/* remove image button */}
                    {(pendingImage?.public_id || modalResource.public_id) && (
                        <button
                            type="button"
                            className="btn btn-warning mt-3 w-full"
                            onClick={async () => {
                                if (pendingImage?.public_id ?? modalResource.public_id) {
                                    await uploadImage(undefined, (pendingImage?.public_id ?? modalResource.public_id));
                                }

                                setPendingImage(null);
                                setModalResource((prev: any) => ({...prev, imageURI: "", public_id: ""}));
                            }}
                        >
                            Remove Image
                        </button>
                    )}
                
                    {/* description */}
                    <label className="font-semibold" htmlFor="descriptionENInput">Description en: </label>
                    <input id="descriptionENInput" className="input input-bordered w-full mb-4"
                        value={modalResource.description.en || ""} 
                        onChange={e => setModalResource({ ...modalResource, description: { ...modalResource.description, en: e.target.value } })}
                    />

                    <label className="font-semibold" htmlFor="descriptionESInput">Description es: </label>
                    <input id="descriptionESInput" className="input input-bordered w-full mb-4"
                        value={modalResource.description.es || ""} 
                        onChange={e => setModalResource({ ...modalResource, description: { ...modalResource.description, es: e.target.value } })}
                    />

                    {/* Link */}
                    <label className="font-semibold" htmlFor="linkInput">Link: </label>
                    <input id="linkInput" className="input input-bordered w-full mb-4"
                        value={modalResource.link || ""}
                        onChange={e => setModalResource({ ...modalResource, link: e.target.value })}
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
                                setModalResource(null);
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
                        {modalResource._id && (
                            <button
                                type="button"
                                className="btn btn-error flex-1"
                                onClick={async () => {
                                    if(modalResource.public_id) {
                                        await uploadImage(undefined, modalResource.public_id);
                                    }

                                    await fetch(`/api/resources?_id=${modalResource._id}`, { method: "DELETE" });
                                    setModalResource(null);
                                    refreshResources();
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