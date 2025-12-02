"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // --- REGISZTRÁCIÓ ---



        if (!isLogin) {
            try {
                const res = await fetch('http://localhost:8080/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (res.ok) {
                    alert('Sikeres regisztráció! Most jelentkezz be.');
                    setIsLogin(true);
                } else {
                    const text = await res.text();
                    setError(text || 'Hiba történt a regisztrációnál.');
                }
            } catch (err) {
                setError('Nem sikerült elérni a szervert.');
            }
        }



        // ---    BEJELENTKEZÉS   ---



        else {
            const authHeader = 'Basic ' + btoa(`${formData.username}:${formData.password}`);

            try {


                // Teszt hívás a backendre


                const res = await fetch('http://localhost:8080/api/phones', {
                    headers: { 'Authorization': authHeader }
                });

                if (res.ok) {
                    localStorage.setItem('auth', authHeader);
                    localStorage.setItem('username', formData.username);
                    router.push('/dashboard');
                } else {
                    setError('Hibás felhasználónév vagy jelszó!');
                }
            } catch (err) {
                setError('Szerver hiba. Fut a backend?');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    {isLogin ? 'Bejelentkezés' : 'Regisztráció'}
                </h2>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Felhasználónév</label>
                        <input
                            type="text"
                            required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                            value={formData.username}
                            onChange={e => setFormData({...formData, username: e.target.value})}
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jelszó</label>
                        <input
                            type="password"
                            required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
                        {isLogin ? 'Belépés' : 'Regisztráció'}
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600 cursor-pointer hover:underline" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Nincs még fiókod? Regisztrálj!' : 'Már van fiókod? Belépés.'}
                </p>
            </div>
        </div>
    );
}