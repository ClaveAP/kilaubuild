"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  addMonths,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { id } from "date-fns/locale";
import {
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  CheckCircle,
  WarningCircle,
  WhatsappLogo,
} from "@phosphor-icons/react";
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

type BookingStep = "schedule" | "details";

const getNextAvailableDay = (): Date => {
  const date = startOfDay(new Date());
  date.setDate(date.getDate() + 1);
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
  const [selectedDate, setSelectedDate] = useState<Date>(() => getNextAvailableDay());
  const [calendarMonth, setCalendarMonth] = useState<Date>(() =>
    startOfMonth(getNextAvailableDay()),
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
  const [bookingStep, setBookingStep] = useState<BookingStep>("schedule");
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

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
        if (active) {
          setCalendarDates(Array.isArray(data?.dates) ? data.dates : []);
        }
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
    () => (Array.isArray(calendarDates) ? calendarDates.map(({ date }) => parseISO(date)) : []),
    [calendarDates],
  );

  const bookedTimes = useMemo(() => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return (
      (Array.isArray(calendarDates)
        ? calendarDates.find((item) => item.date === dateKey)?.bookedTimes
        : []) ?? []
    );
  }, [calendarDates, selectedDate]);

  const selectedTimeIsBooked = bookedTimes.some((bookedTime) =>
    isTimeOccupied(selectedTime, bookedTime),
  );

  const validateSchedule = (): boolean => {
    const timeInMinutes = timeToMinutes(selectedTime);
    if (timeInMinutes < 540 || timeInMinutes > 1200 || timeInMinutes % 30 !== 0) {
      setErrorMessage("Pilih jam antara 09.00–20.00 WIB dalam interval 30 menit.");
      return false;
    }

    if (selectedTimeIsBooked) {
      setErrorMessage(`Jam ${selectedTime} sudah dibooking. Silakan pilih jam lain.`);
      return false;
    }

    return true;
  };

  const changeStep = (step: BookingStep) => {
    setErrorMessage(null);
    setBookingStep(step);
    window.requestAnimationFrame(() => stepHeadingRef.current?.focus());
  };

  const continueToDetails = () => {
    setErrorMessage(null);
    if (validateSchedule()) changeStep("details");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!validateSchedule()) return;

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
    <section id="booking" className="scroll-mt-20 lg:scroll-mt-6 border-b border-[#CBD8DF] bg-[#FBFBFA] py-16 sm:py-20 lg:py-24">
      <div className="site-shell">
        <div className="grid w-full items-start gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="space-y-4 lg:col-span-5">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#005592]/15 bg-[#005592]/5 px-3.5 py-1 text-xs font-semibold text-[#005592]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#005592]" />
              <span>Jadwal Survei Lapangan</span>
            </div>
            <h2 className="mt-2 text-[clamp(2.1rem,3.4vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.025em] text-[#092436]">
              Pilih sendiri waktu <span className="font-serif italic font-normal text-[#005592]">survei lokasi.</span>
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-[#526474]">
              Survei tersedia Senin sampai Jumat, pukul 09.00–20.00 WIB. Kalender interaktif ini menampilkan tanggal dan jam yang tersedia secara langsung.
            </p>

            <div className="space-y-3 pt-2">
              <div className="rounded-2xl border border-[#E2ECF2] bg-white p-5 shadow-xs">
                <h4 className="text-sm font-bold text-[#092436]">Kalender Terbuka &amp; Real-time</h4>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#526474]">
                  Tanggal bertanda biru menunjukkan adanya jadwal aktif. Pilih tanggal untuk melihat slot jam yang masih lowong.
                </p>
              </div>
              <div className="rounded-2xl border border-[#E2ECF2] bg-white p-5 shadow-xs">
                <h4 className="text-sm font-bold text-[#092436]">RAB Terperinci &amp; Bebas Komitmen</h4>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#526474]">
                  Setelah survei, Anda akan menerima rincian spesifikasi material dan RAB untuk dipelajari tanpa paksaan kontrak.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <p className="mb-2 text-xs font-semibold text-[#526474]">Perlu konfirmasi cepat?</p>
              <a
                href="https://wa.me/6287776360795?text=Halo%20KilauBuild%2C%20saya%20ingin%20tanya%20seputar%20survey%20lokasi"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[#005592] pl-5 pr-2 py-1.5 text-xs font-bold text-white shadow-xs transition-all duration-300 hover:bg-[#0066AE] active:scale-[0.98]"
              >
                <WhatsappLogo size={16} weight="fill" className="text-white" />
                <span>Tanyakan via WhatsApp</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowUpRight size={14} weight="bold" />
                </span>
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E2ECF2] bg-white p-6 shadow-[0_12px_36px_-16px_rgba(0,68,117,0.08)] sm:p-9 lg:col-span-7">
            {successData ? (
              <div className="space-y-6 py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF4FA] text-[#005592]">
                  <CheckCircle size={36} weight="fill" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0A1E2F]">Jadwal survey sudah tercatat.</h3>
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
                    <WhatsappLogo size={20} weight="fill" aria-hidden="true" />
                    Konfirmasi via WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessData(null);
                      setBookingStep("schedule");
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
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-4">
                  <div>
                    <h3
                      ref={stepHeadingRef}
                      tabIndex={-1}
                      className="text-xl font-bold text-[#0A1E2F] outline-none sm:text-2xl"
                    >
                      {bookingStep === "schedule" ? "Pilih jadwal kunjungan" : "Lengkapi data proyek"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {bookingStep === "schedule"
                        ? "Hari kerja, 09.00–20.00 WIB. Waktu zona Jakarta."
                        : "Data ini membantu tim menyiapkan survey yang tepat."}
                    </p>
                  </div>
                  <ol aria-label="Progres booking" className="flex shrink-0 items-center gap-2 pt-1">
                    <li
                      aria-current={bookingStep === "schedule" ? "step" : undefined}
                      className={`font-numeric flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${bookingStep === "schedule" ? "bg-[#005592] text-white" : "bg-[#EBF4FA] text-[#005592]"}`}
                    >
                      01
                    </li>
                    <li aria-hidden="true" className="h-px w-4 bg-[#B8CAD4]" />
                    <li
                      aria-current={bookingStep === "details" ? "step" : undefined}
                      className={`font-numeric flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${bookingStep === "details" ? "bg-[#005592] text-white" : "bg-slate-100 text-slate-500"}`}
                    >
                      02
                    </li>
                  </ol>
                </div>

                {(errorMessage || calendarError) && (
                  <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                    <WarningCircle size={20} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{errorMessage ?? calendarError}</span>
                  </div>
                )}

                {bookingStep === "schedule" ? (
                  <>
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(15rem,0.85fr)]">
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
                      disabled={[{ before: startOfDay(new Date()) }]}
                      startMonth={startOfMonth(new Date())}
                      endMonth={addMonths(startOfMonth(new Date()), 12)}
                      modifiers={{ booked: bookedDates, sunday: { dayOfWeek: [0] } }}
                      modifiersClassNames={{ booked: "rdp-booked", sunday: "rdp-sunday" }}
                      showOutsideDays
                      className="booking-calendar"
                    />
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#005592]" />Ada booking</span>
                      <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />Minggu (tetap buka)</span>
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-slate-200 pt-5 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
                    <div>
                      <p className="text-xs font-semibold text-[#005592]">Tanggal dipilih</p>
                      <p className="mt-1 text-lg font-bold leading-snug text-[#0A1E2F]">{formatDisplayDate(selectedDate)}</p>
                    </div>
                    <div>
                      <label htmlFor="booking-time" className="text-sm font-semibold text-slate-900">Jam kedatangan</label>
                      <div className="mt-2">
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
                          className="form-field py-2.5"
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
                <button
                  type="button"
                  onClick={continueToDetails}
                  disabled={selectedTimeIsBooked}
                  className="group flex min-h-12 w-full items-center justify-between rounded-full bg-[#005592] py-2 pl-6 pr-2 text-xs font-bold text-white shadow-xs transition-all duration-300 hover:bg-[#0066AE] disabled:bg-[#80909A] active:scale-[0.98]"
                >
                  <span>Lanjut Isi Data Proyek</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                    <CaretRight size={14} weight="bold" aria-hidden="true" />
                  </span>
                </button>
                  </>
                ) : (
                  <>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E2ECF2] bg-[#F8FBFD] px-5 py-3.5 text-xs sm:text-sm">
                  <div>
                    <p className="font-bold text-[#092436]">{formatDisplayDate(selectedDate)}</p>
                    <p className="mt-0.5 text-[#526474]">Pukul <span className="font-numeric font-bold text-[#005592]">{selectedTime}</span> WIB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => changeStep("schedule")}
                    className="min-h-9 rounded-full border border-[#005592]/20 bg-white px-3.5 text-xs font-bold text-[#005592] transition-colors hover:bg-[#EBF4FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005592]"
                  >
                    Ubah jadwal
                  </button>
                </div>

                <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="booking-service" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-800">Layanan</label>
                    <select
                      id="booking-service"
                      value={formData.serviceType}
                      onChange={(event) => setFormData({ ...formData, serviceType: event.target.value })}
                      className="form-field rounded-xl"
                    >
                      <option value="Bangun Rumah Baru">Bangun Rumah Baru</option>
                      <option value="Renovasi Total">Renovasi Total</option>
                      <option value="Desain Interior">Desain Interior & Custom</option>
                      <option value="Desain Arsitektur & RAB">Desain Arsitektur & RAB</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="booking-name" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-800">Nama lengkap</label>
                    <input id="booking-name" type="text" autoComplete="name" value={formData.clientName} onChange={(event) => setFormData({ ...formData, clientName: event.target.value })} required className="form-field rounded-xl" />
                  </div>
                  <div>
                    <label htmlFor="booking-phone" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-800">Nomor WhatsApp</label>
                    <input id="booking-phone" type="tel" autoComplete="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} required className="form-field rounded-xl" />
                  </div>
                  <div>
                    <label htmlFor="booking-email" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-800">Alamat email</label>
                    <input id="booking-email" type="email" autoComplete="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required className="form-field rounded-xl" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="booking-location" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-800">Lokasi proyek</label>
                    <input id="booking-location" type="text" autoComplete="street-address" value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} required className="form-field rounded-xl" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="booking-notes" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-800">Catatan tambahan <span className="font-normal text-slate-500">(opsional)</span></label>
                    <textarea id="booking-notes" rows={2} value={formData.notes} onChange={(event) => setFormData({ ...formData, notes: event.target.value })} className="form-field rounded-xl min-h-20 resize-y" />
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => changeStep("schedule")}
                    className="group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-[#CBD8DF] bg-white py-1.5 pl-2 pr-5 text-xs font-bold text-[#092436] transition-all hover:border-[#005592]/30 hover:bg-[#F8FBFD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005592] sm:w-auto"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF3F8] text-[#005592] transition-transform duration-300 group-hover:-translate-x-0.5">
                      <CaretLeft size={14} weight="bold" aria-hidden="true" />
                    </span>
                    <span>Kembali</span>
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || selectedTimeIsBooked}
                    className="group flex min-h-12 flex-1 items-center justify-between rounded-full bg-[#005592] py-2 pl-6 pr-2 text-xs font-bold text-white shadow-xs transition-all duration-300 hover:bg-[#0066AE] disabled:bg-[#80909A] active:scale-[0.98]"
                  >
                    <span>{submitting ? "Menyimpan jadwal..." : "Ajukan Booking Survei Gratis"}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                      <CaretRight size={14} weight="bold" aria-hidden="true" />
                    </span>
                  </button>
                </div>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
