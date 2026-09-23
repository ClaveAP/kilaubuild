import React from "react";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#004475] text-white">
      <div className="border-b border-white/15 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-7 md:grid-cols-3 md:gap-0">
            <div className="md:pr-10">
              <p className="text-xs font-semibold uppercase text-[#8CC9EC]">Pembayaran</p>
              <p className="mt-2 font-serif text-xl font-medium text-white">Bangun dulu, baru bayar.</p>
              <p className="mt-1 text-sm leading-6 text-white/70">Termin mengikuti progres fisik yang dapat Anda periksa.</p>
            </div>
            <div className="border-t border-white/15 pt-7 md:border-l md:border-t-0 md:px-10 md:pt-0">
              <p className="text-xs font-semibold uppercase text-[#8CC9EC]">Perlindungan</p>
              <p className="mt-2 font-serif text-xl font-medium text-white">Garansi retensi 3 bulan.</p>
              <p className="mt-1 text-sm leading-6 text-white/70">Jaminan perbaikan setelah pekerjaan diserahterimakan.</p>
            </div>
            <div className="border-t border-white/15 pt-7 md:border-l md:border-t-0 md:pl-10 md:pt-0">
              <p className="text-xs font-semibold uppercase text-[#8CC9EC]">Perencanaan</p>
              <p className="mt-2 font-serif text-xl font-medium text-white">Survey dan RAB gratis.</p>
              <p className="mt-1 text-sm leading-6 text-white/70">Mulai dari angka yang jelas, tanpa biaya konsultasi awal.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-white p-1">
                <Image
                  src="/logo.png"
                  alt="KilauBuild Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-2xl font-semibold text-white">
                KilauBuild
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Jasa kontraktor bangun rumah, renovasi, dan interior terpercaya di wilayah Depok & Jabodetabek. Mewujudkan hunian impian dengan aman dan transparan.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#66B2E0] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram KilauBuild"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/6287776360795"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#25D366] flex items-center justify-center text-white transition-colors"
                aria-label="WhatsApp KilauBuild"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Layanan Kami</h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li><a href="#layanan" className="hover:text-white transition-colors">Bangun Rumah dari Nol</a></li>
              <li><a href="#layanan" className="hover:text-white transition-colors">Renovasi Total & Parsial</a></li>
              <li><a href="#interior" className="hover:text-white transition-colors">Desain Interior & Custom Furniture</a></li>
              <li><a href="#layanan" className="hover:text-white transition-colors">Pembuatan Gambar Kerja & 3D</a></li>
              <li><a href="#booking" className="hover:text-white transition-colors">Survey Lokasi & Estimasi RAB</a></li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Navigasi</h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li><a href="#hero" className="hover:text-white transition-colors">Beranda</a></li>
              <li><a href="#portofolio" className="hover:text-white transition-colors">Portofolio Selesai</a></li>
              <li><a href="#portofolio" className="hover:text-white transition-colors">Proyek Berjalan (Ongoing)</a></li>
              <li><a href="#testimoni" className="hover:text-white transition-colors">Testimoni Klien</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Tanya Jawab (FAQ)</a></li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4">Kontak & Workshop</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#66B2E0] shrink-0 mt-0.5" />
                <span>Jl. Raya Citayam No.34, RT.01/RW.04, Pd. Jaya, Cipayung, Kota Depok, Jawa Barat 16444</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#66B2E0] shrink-0" />
                <a href="https://wa.me/6287776360795" className="hover:text-white transition-colors">
                  +62 877-7636-0795
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#66B2E0] shrink-0" />
                <a href="mailto:kilaubuild@gmail.com" className="hover:text-white transition-colors">
                  kilaubuild@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} KilauBuild. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Standar Konstruksi Terpercaya</span>
            <span>•</span>
            <span>Depok, Jawa Barat</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
