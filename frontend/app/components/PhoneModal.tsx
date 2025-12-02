import { useState, useEffect } from 'react';
import { Phone } from '../types';
import { X } from 'lucide-react';

interface PhoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    phoneToEdit: Phone | null;
}

export default function PhoneModal({ isOpen, onClose, onSave, phoneToEdit }: PhoneModalProps) {
    const [formData, setFormData] = useState({ brand: '', model: '', price: 0, description: '', imageUrl: '' });

    useEffect(() => {
        if (phoneToEdit) {
            setFormData({
                brand: phoneToEdit.brand,
                model: phoneToEdit.model,
                price: phoneToEdit.price,
                description: phoneToEdit.description || '',
                imageUrl: phoneToEdit.imageUrl || ''
            });
        } else {
            setFormData({ brand: '', model: '', price: 0, description: '', imageUrl: '' });
        }
    }, [phoneToEdit, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">{phoneToEdit ? 'Hirdetés szerkesztése' : 'Új hirdetés feladása'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Márka</label>
                            <input
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                placeholder="pl. Apple"
                                value={formData.brand}
                                onChange={e => setFormData({...formData, brand: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Modell</label>
                            <input
                                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                placeholder="pl. iPhone 15"
                                value={formData.model}
                                onChange={e => setFormData({...formData, model: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ár (Ft)</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kép URL</label>
                        <input
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                            placeholder="http://..."
                            value={formData.imageUrl}
                            onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Leírás</label>
                        <textarea
                            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 text-black"
                            placeholder="Írj pár szót az állapotáról..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">Mégse</button>
                        <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition">Mentés</button>
                    </div>
                </form>
            </div>
        </div>
    );
}