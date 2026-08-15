"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { DEPARTMENTS } from "@/lib/utils";

const DEFAULT_AVATAR_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="24" fill="#4f46e5"/><circle cx="48" cy="38" r="16" fill="#c7d2fe"/><path d="M20 80c4-16 14-24 28-24s24 8 28 24" fill="#c7d2fe"/></svg>';

const DEFAULT_AVATAR =
  "data:image/svg+xml;base64," +
  btoa(DEFAULT_AVATAR_SVG);

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setDepartment(user.department || DEPARTMENTS[0]);
    setDesignation(user.designation || "");
    setEmployeeId(user.employeeId || "");
    setPhone(user.phone || "");
    setEmail(user.email || "");
    setOfficeLocation(user.officeLocation || "");
    setCity(user.city || "");
    setBio(user.bio || "");
    setProfilePhoto(user.profilePhoto || "");
  }, [user]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Photo must be smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePhoto(String(reader.result));
      setError("");
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          department,
          designation,
          employeeId,
          phone,
          email,
          officeLocation,
          city,
          bio,
          profilePhoto,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save profile");
      }
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          My Profile
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="glass p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center border border-white/10 shadow-glow-primary">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src={DEFAULT_AVATAR} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-primary-500 hover:bg-primary-400 text-white text-xs font-medium shadow-lg transition-all whitespace-nowrap"
              >
                Upload Photo
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
                aria-label="Upload profile photo"
              />
            </div>
            <div className="flex-1 w-full">
              <p className="text-base font-semibold text-surface-900 dark:text-white">
                {user?.name}
              </p>
              <p className="text-sm text-surface-500">@{user?.username}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="badge badge-primary">{user?.role}</span>
                <span className="badge badge-surface">{department || user?.department}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-6">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-white mb-4 uppercase tracking-wider">
            Basic Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field text-sm"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
                Designation / Post
              </label>
              <input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="input-field text-sm"
                placeholder="e.g. Junior Clerk"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
                Employee ID
              </label>
              <input
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="input-field text-sm"
                placeholder="e.g. KPGU-1042"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="input-field text-sm"
                required
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="glass p-6">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-white mb-4 uppercase tracking-wider">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
                Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field text-sm"
                placeholder="e.g. 98765 43210"
                inputMode="tel"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field text-sm"
                placeholder="you@example.com"
                type="email"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
                Office Location
              </label>
              <input
                value={officeLocation}
                onChange={(e) => setOfficeLocation(e.target.value)}
                className="input-field text-sm"
                placeholder="e.g. Collectorate, Ward 3"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">
                City
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input-field text-sm"
                placeholder="e.g. Nagpur"
              />
            </div>
          </div>
        </div>

        <div className="glass p-6">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-white mb-4 uppercase tracking-wider">
            About
          </h2>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input-field text-sm min-h-[100px]"
            placeholder="Tell colleagues a bit about yourself…"
            maxLength={300}
          />
          <p className="text-[10px] text-surface-500 mt-1 text-right">
            {bio.length}/300
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-btn animate-slide-down">
            {error}
          </div>
        )}
        {saved && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-3 rounded-btn animate-slide-down">
            Profile saved successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
