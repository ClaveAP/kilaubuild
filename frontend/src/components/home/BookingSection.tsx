"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  format,
  isWeekend,
  parseISO,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { id } from "date-fns/locale";
import { AlertCircle, CheckCircle2, Clock3, Phone } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { getApiData, postApiData } from "@/lib/api";

interface BookingRecord {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  serviceType: string;
  location: string;
  bookingDate: string;
  timeSlot: string;
  status: string;
  notes?: string;
}

interface BookingSuccessResponse {
  booking: BookingRecord;
  whatsappUrl: string;
}

interface CalendarDate {
  date: string;
  bookingCount: number;
  bookedTimes: string[];
}

interface BookingCalendarData {
  month: string;
  timezone: string;
  businessDays: number[];
  businessHours: {
    opensAt: string;
    closesAt: string;
    intervalMinutes: number;
  };
  dates: CalendarDate[];
}

const getNextBusinessDay = (): Date => {
  const date = startOfDay(new Date());
  date.setDate(date.getDate() + 1);
  while (isWeekend(date)) date.setDate(date.getDate() + 1);
  return date;
};

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const isTimeOccupied = (requestedTime: string, bookedTime: string): boolean => {
  if (!bookedTime.includes(" - ")) return requestedTime === bookedTime;

  const [startTime, endTime] = bookedTime.split(" - ");
  const requested = timeToMinutes(requestedTime);
  return requested >= timeToMinutes(startTime) && requested < timeToMinutes(endTime);
};

const formatDisplayDate = (date: Date): string =>
  new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

export const BookingSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(() => getNextBusinessDay());
  const [calendarMonth, setCalendarMonth] = useState<Date>(() =>
    startOfMonth(getNextBusinessDay()),
  );
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [calendarVersion, setCalendarVersion] = useState(0);

  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    phone: "",
    serviceType: "Bangun Rumah Baru",
    location: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<BookingSuccessResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchCalendar = async () => {
      setLoadingCalendar(true);
      setCalendarError(null);
      try {
        const month = format(calendarMonth, "yyyy-MM");
        const data = await getApiData<BookingCalendarData>(
          `/bookings/calendar?month=${month}`,
        );
        if (active) setCalendarDates(data.dates);
      } catch (error: unknown) {
        console.warn("Gagal memuat kalender booking:", error);
        if (active) {
          setCalendarDates([]);
          setCalendarError("Kalender booking belum dapat dimuat. Anda masih dapat mengajukan jadwal.");
        }
      } finally {
        if (active) setLoadingCalendar(false);
      }
    };

    fetchCalendar();
    return () => {
      active = false;
    };
  }, [calendarMonth, calendarVersion]);

  const bookedDates = useMemo(
    () => calendarDates.map(({ date }) => parseISO(date)),
    [calendarDates],
  );

  const bookedTimes = useMemo(() => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return calendarDates.find((item) => item.date === dateKey)?.bookedTimes ?? [];
  }, [calendarDates, selectedDate]);

  const selectedTimeIsBooked = bookedTimes.some((bookedTime) =>
    isTimeOccupied(selectedTime, bookedTime),
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (isWeekend(selectedDate)) {
      setErrorMessage("Pilih hari kerja, Senin sampai Jumat.");
      return;
    }

    const timeInMinutes = timeToMinutes(selectedTime);
    if (timeInMinutes < 540 || timeInMinutes > 1200 || timeInMinutes % 30 !== 0) {
      setErrorMessage("Pilih jam antara 09.00–20.00 WIB dalam interval 30 menit.");
      return;
    }

    if (selectedTimeIsBooked) {
      setErrorMessage(`Jam ${selectedTime} sudah dibooking. Silakan pilih jam lain.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        bookingDate: format(selectedDate, "yyyy-MM-dd"),
        timeSlot: selectedTime,
      };

      const response = await postApiData<BookingSuccessResponse, typeof payload>(
        "/bookings",
        payload,
      );
      setSuccessData(response);
      setCalendarVersion((version) => version + 1);
    } catch (error: unknown) {
      const apiError = error as { message?: string | string[] };
      const message =
        apiError.message ??
        "Jadwal belum berhasil disimpan. Periksa kembali tanggal dan jam yang dipilih.";
      setErrorMessage(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="relative bg-transparent py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <h2 className="font-serif text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              Jadwalkan Survey Lokasi & <span className="text-[#005592]">Konsultasi Gratis</span>
            </h2>

            <p className="text-base leading-relaxed text-slate-600">
              Pilih hari kerja dan tentukan sendiri jam kedatangan tim kami. Survey tersedia Senin–Jumat, pukul 09.00–20.00 WIB.
            </p>

            <dl className="border-y border-slate-300/80">
              <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="font-serif text-lg font-semibold text-slate-950">Kalender terbuka</dt>
                <dd className="text-sm leading-6 text-slate-600">
                  Tanggal bertanda biru sudah memiliki jadwal. Pilih tanggalnya untuk melihat jam yang terisi.
                </dd>
              </div>
              <div className="grid gap-2 border-t border-slate-200 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="font-serif text-lg font-semibold text-slate-950">RAB terbuka</dt>
                <dd className="text-sm leading-6 text-slate-600">
                  Setelah survey, Anda menerima rincian material dan biaya untuk dipelajari tanpa komitmen.
                </dd>
              </div>
            </dl>

            <div className="pt-2">
              <p className="mb-2 text-xs font-medium text-slate-500">Perlu jawaban lebih cepat?</p>
              <a
                href="https://wa.me/6287776360795"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#005592] transition-colors hover:text-[#0066AE]"
              >
                <Phone className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
                <span>WhatsApp +62 877-7636-0795</span>
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.55)] sm:p-10 lg:col-span-7">
            {successData ? (
              <div className="space-y-6 py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF4FA] text-[#005592]">
                  <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-slate-950">Jadwal survey sudah tercatat.</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                    Terima kasih, <strong>{successData.booking.clientName}</strong>. Kami mencatat kunjungan pada {formatDisplayDate(selectedDate)} pukul {selectedTime} WIB.
                  </p>
                </div>
                <div className="mx-auto max-w-md border-y border-slate-200 py-4 text-left text-sm text-slate-700">
                  <p><strong>Layanan:</strong> {successData.booking.serviceType}</p>
                  <p className="mt-1"><strong>Lokasi:</strong> {successData.booking.location}</p>
                  <p className="mt-1"><strong>WhatsApp:</strong> {successData.booking.phone}</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href={successData.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#20ba59] sm:w-auto"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Konfirmasi via WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessData(null);
                      setSelectedTime("09:00");
                      setFormData({
                        clientName: "",
                        email: "",
                        phone: "",
                        serviceType: "Bangun Rumah Baru",
                        location: "",
                        notes: "",
                      });
                    }}
                    className="min-h-11 px-4 text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-950"
                  >
                    Buat jadwal lain
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="font-serif text-2xl font-semibold text-slate-950">Pilih jadwal kunjungan</h3>
                  <p className="mt-1 text-sm text-slate-500">Hari kerja, 09.00–20.00 WIB. Waktu ditampilkan dalam zona Jakarta.</p>
                </div>

                {(errorMessage || calendarError) && (
                  <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>{errorMessage ?? calendarError}</span>
                  </div>
                )}

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(15rem,0.85fr)]">
                  <div className="min-w-0">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <label className="text-sm font-semibold text-slate-900">Tanggal survey</label>
                      {loadingCalendar && <span className="text-xs text-slate-500">Memuat kalender...</span>}
                    </div>
                    <DayPicker
                      mode="single"
                      locale={id}
                      month={calendarMonth}
                      onMonthChange={setCalendarMonth}
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setErrorMessage(null);
                        }
                      }}
                      disabled={[{ before: startOfDay(new Date()) }, { dayOfWeek: [0, 6] }]}
                      startMonth={startOfMonth(new Date())}
                      endMonth={addMonths(startOfMonth(new Date()), 12)}
                      modifiers={{ booked: bookedDates }}
                      modifiersClassNames={{ booked: "rdp-booked" }}
                      showOutsideDays
                      className="booking-calendar"
                    />
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#005592]" />Ada booking</span>
                      <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full border border-slate-300 bg-slate-100" />Akhir pekan</span>
                    </div>
                  </div>

                  <div className="space-y-5 border-t border-slate-200 pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
                    <div>
                      <p className="text-xs font-semibold text-[#005592]">Tanggal dipilih</p>
                      <p className="mt-1 font-serif text-lg font-semibold leading-snug text-slate-950">{formatDisplayDate(selectedDate)}</p>
                    </div>
                    <div>
                      <label htmlFor="booking-time" className="text-sm font-semibold text-slate-900">Jam kedatangan</label>
                      <div className="relative mt-2">
                        <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                        <input
                          id="booking-time"
                          type="time"
                          min="09:00"
                          max="20:00"
                          step="1800"
                          value={selectedTime}
                          onChange={(event) => {
                            setSelectedTime(event.target.value);
                            setErrorMessage(null);
                          }}
                          aria-describedby="booking-time-hint"
                          required
                          className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-base text-slate-950 focus:border-[#005592] focus:outline-none focus:ring-2 focus:ring-[#005592]/20"
                        />
                      </div>
                      <p id="booking-time-hint" className="mt-2 text-xs leading-5 text-slate-500">Pilih per 30 menit, dari 09.00 sampai 20.00 WIB.</p>
                    </div>

                    <div aria-live="polite">
                      <p className="text-sm font-semibold text-slate-900">Jam yang sudah dibooking</p>
                      {bookedTimes.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {bookedTimes.map((time) => (
                            <span key={time} className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 line-through decoration-red-500">
                              {time}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-xs leading-5 text-emerald-700">Belum ada booking pada tanggal ini.</p>
                      )}
                      {selectedTimeIsBooked && (
                        <p className="mt-3 text-xs font-semibold text-red-700">Jam {selectedTime} sudah terisi. Pilih jam lain.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="booking-service" className="mb-1.5 block text-sm font-semibold text-slate-800">Layanan</label>
                    <select
                      id="booking-service"
                      value={formData.serviceType}
                      onChange={(event) => setFormData({ ...formData, serviceType: event.target.value })}
                      className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 focus:border-[#005592] focus:outline-none focus:ring-2 focus:ring-[#005592]/20"
                    >
                      <option value="Bangun Rumah Baru">Bangun Rumah Baru</option>
                      <option value="Renovasi Total">Renovasi Total</option>
                      <option value="Desain Interior">Desain Interior & Custom</option>
                      <option value="Desain Arsitektur & RAB">Desain Arsitektur & RAB</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="booking-name" className="mb-1.5 block text-sm font-semibold text-slate-800">Nama lengkap</label>
                    <input id="booking-name" type="text" value={formData.clientName} onChange={(event) => setFormData({ ...formData, clientName: event.target.value })} required className="min-h-12 w-full rounded-xl border border-slate-300 px-4 text-base text-slate-950 focus:border-[#005592] focus:outline-none focus:ring-2 focus:ring-[#005592]/20" />
                  </div>
                  <div>
                    <label htmlFor="booking-phone" className="mb-1.5 block text-sm font-semibold text-slate-800">Nomor WhatsApp</label>
                    <input id="booking-phone" type="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} required className="min-h-12 w-full rounded-xl border border-slate-300 px-4 text-base text-slate-950 focus:border-[#005592] focus:outline-none focus:ring-2 focus:ring-[#005592]/20" />
                  </div>
                  <div>
                    <label htmlFor="booking-email" className="mb-1.5 block text-sm font-semibold text-slate-800">Alamat email</label>
                    <input id="booking-email" type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required className="min-h-12 w-full rounded-xl border border-slate-300 px-4 text-base text-slate-950 focus:border-[#005592] focus:outline-none focus:ring-2 focus:ring-[#005592]/20" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="booking-location" className="mb-1.5 block text-sm font-semibold text-slate-800">Lokasi proyek</label>
                    <input id="booking-location" type="text" value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} required className="min-h-12 w-full rounded-xl border border-slate-300 px-4 text-base text-slate-950 focus:border-[#005592] focus:outline-none focus:ring-2 focus:ring-[#005592]/20" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="booking-notes" className="mb-1.5 block text-sm font-semibold text-slate-800">Catatan tambahan <span className="font-normal text-slate-500">(opsional)</span></label>
                    <textarea id="booking-notes" rows={3} value={formData.notes} onChange={(event) => setFormData({ ...formData, notes: event.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-950 focus:border-[#005592] focus:outline-none focus:ring-2 focus:ring-[#005592]/20" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || selectedTimeIsBooked}
                  className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#005592] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0066AE] disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {submitting ? "Menyimpan jadwal..." : "Ajukan Booking Survey Gratis"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
