import Link from 'next/link';
import { Smartphone, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2 font-bold text-2xl">
                    <Smartphone className="text-blue-500" />
                    <span>Phone<span className="text-blue-500">Shop</span></span>
                </div>
                <Link href="/login" className="px-6 py-2 rounded-full border border-gray-600 hover:bg-gray-800 transition">
                    Belépés
                </Link>
            </nav>

            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    A jövő telefonjai,<br /> egy helyen.
                </h1>
                <p className="text-gray-400 text-xl max-w-2xl mb-10">
                    Add el a régit, vedd meg az újat. Biztonságos piactér, ellenőrzött felhasználók, villámgyors tranzakciók.
                </p>

                <div className="flex gap-4">
                    <Link href="/login" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-500/30">
                        Kezdés most <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl text-left">
                    <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                        <ShieldCheck className="text-green-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">Biztonságos</h3>
                        <p className="text-gray-400">Minden hirdetés ellenőrzött, csak regisztrált felhasználók adhatnak el.</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                        <Smartphone className="text-blue-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">Nagy választék</h3>
                        <p className="text-gray-400">A legújabb iPhone-októl a klasszikus nyomógombosig minden.</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                        <Zap className="text-yellow-400 mb-4" size={32} />
                        <h3 className="text-xl font-bold mb-2">Gyors</h3>
                        <p className="text-gray-400">Hirdesd meg 2 perc alatt, és találd meg a vevőt azonnal.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}