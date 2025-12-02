import { Phone } from '../types';
import { Edit, Trash2 } from 'lucide-react';

interface PhoneCardProps {
    phone: Phone;
    onEdit: (phone: Phone) => void;
    onDelete: (id: number) => void;
}

export default function PhoneCard({ phone, onEdit, onDelete }: PhoneCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="h-56 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                {phone.imageUrl ? (
                    <img src={phone.imageUrl} alt={phone.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="text-gray-300 text-6xl font-thin">?</div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-700 shadow-sm">
                    {phone.price.toLocaleString()} Ft
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900">{phone.brand} <span className="text-gray-600 font-normal">{phone.model}</span></h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2 h-10">{phone.description}</p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                    <button
                        onClick={() => onEdit(phone)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Szerkesztés">
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(phone.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Törlés">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}