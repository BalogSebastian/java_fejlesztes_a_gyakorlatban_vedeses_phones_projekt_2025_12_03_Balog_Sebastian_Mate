"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, User } from '../types';
import PhoneCard from '../components/PhoneCard';
import PhoneModal from '../components/PhoneModal';
import { Plus, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const [phones, setPhones] = useState<Phone[]>([]);


    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPhone, setEditingPhone] = useState<Phone | null>(null);

    useEffect(() => {
        const auth = localStorage.getItem('auth');
        if (!auth) {
            router.push('/login');
            return;
        }
        fetchUserInfo(auth);
        fetchPhones(auth);
    }, []);



    const fetchUserInfo = async (auth: string) => {
        try {
            const res = await fetch('http://localhost:8080/api/auth/me', {
                headers: { 'Authorization': auth }
            });
            if (res.ok) {
                const userData = await res.json();
                setCurrentUser(userData);
            } else {

                // Ha lejárt a session vagy hiba van

                localStorage.clear();
                router.push('/login');
            }
        } catch (err) {
            console.error("Nem sikerült lekérni a user adatait", err);
        }
    };




    const fetchPhones = async (auth: string) => {
        try {
            const res = await fetch('http://localhost:8080/api/phones', {
                headers: { 'Authorization': auth }
            });
            const data = await res.json();
            setPhones(data);
        } catch (err) {
            console.error("Hiba", err);
        }
    };

    const handleSave = async (formData: any) => {
        const auth = localStorage.getItem('auth') || '';
        const url = editingPhone
            ? `http://localhost:8080/api/phones/${editingPhone.id}`
            : 'http://localhost:8080/api/phones';

        const method = editingPhone ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': auth },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            setIsModalOpen(false);
            fetchPhones(auth);
        } else {
            alert('Hiba! (Nincs jogosultságod?)');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Biztos törlöd?')) return;
        const auth = localStorage.getItem('auth') || '';

        const res = await fetch(`http://localhost:8080/api/phones/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': auth }
        });

        if (res.ok) fetchPhones(auth);
        else alert("Nem törölheted más hirdetését!");
    };

    const logout = () => {
        localStorage.clear();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">PhoneShop</span>

                    <div className="flex items-center gap-6">
                        {currentUser && (
                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${currentUser.role === 'ADMIN' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                                {currentUser.role === 'ADMIN' ? <ShieldCheck size={18} /> : <UserIcon size={18} />}
                                <div className="flex flex-col leading-tight">
                                    <span className="font-bold text-sm">{currentUser.username}</span>
                                    <span className="text-[10px] uppercase tracking-wider opacity-70">{currentUser.role}</span>
                                </div>
                            </div>
                        )}

                        <button onClick={logout} className="text-gray-500 hover:text-red-600 flex items-center gap-1 font-medium text-sm transition">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {currentUser?.role === 'ADMIN' ? 'Összes Hirdetés (Admin Nézet)' : 'Saját Hirdetéseim'}
                        </h1>
                        <p className="text-gray-500">
                            {currentUser?.role === 'ADMIN'
                                ? 'Itt látod az összes felhasználó telefonját.'
                                : 'Itt kezelheted az általad feltöltött készülékeket.'}
                        </p>
                    </div>
                    <button
                        onClick={() => { setEditingPhone(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition transform hover:scale-105"
                    >
                        <Plus size={20} /> Új Hirdetés
                    </button>
                </div>

                {phones.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-xl">Még nincsenek hirdetések.</p>
                        <p className="text-sm mt-2">Adj hozzá egyet a gombra kattintva!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {phones.map(phone => (
                            <PhoneCard
                                key={phone.id}
                                phone={phone}
                                onEdit={(p) => { setEditingPhone(p); setIsModalOpen(true); }}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>

            <PhoneModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                phoneToEdit={editingPhone}
            />
        </div>
    );
}