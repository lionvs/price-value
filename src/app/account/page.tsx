"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserById } from "@/lib/users";
import { User } from "@/types";

export default function AccountPage() {
  const { user, isHydrated, logout } = useAuth();
  const router = useRouter();
  const [fullUser, setFullUser] = useState<User | null>(null);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/login");
    }
    if (user) {
      const found = getUserById(user.userId);
      if (found) setFullUser(found);
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !user || !fullUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-pv-gray-300 rounded w-48" />
          <div className="h-4 bg-pv-gray-300 rounded w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-pv-gray-900 mb-6">My Account</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Profile header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-pv-blue text-white font-bold text-xl flex items-center justify-center">
            {fullUser.avatar}
          </div>
          <div>
            <h2 className="text-lg font-bold text-pv-gray-900">
              {fullUser.firstName} {fullUser.lastName}
            </h2>
            <p className="text-sm text-pv-gray-500">{fullUser.email}</p>
          </div>
        </div>

        <hr className="border-pv-gray-300" />

        {/* Contact info */}
        <div>
          <h3 className="font-semibold text-sm text-pv-gray-900 mb-2">
            Contact Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-pv-gray-500">Email</span>
              <p className="text-pv-gray-900">{fullUser.email}</p>
            </div>
            <div>
              <span className="text-pv-gray-500">Phone</span>
              <p className="text-pv-gray-900">{fullUser.phone}</p>
            </div>
          </div>
        </div>

        <hr className="border-pv-gray-300" />

        {/* Address */}
        <div>
          <h3 className="font-semibold text-sm text-pv-gray-900 mb-2">
            Shipping Address
          </h3>
          <p className="text-sm text-pv-gray-700">
            {fullUser.address.street}
            <br />
            {fullUser.address.city}, {fullUser.address.state}{" "}
            {fullUser.address.zipCode}
          </p>
        </div>

        <hr className="border-pv-gray-300" />

        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="bg-pv-red text-white font-bold py-2 px-6 rounded-md text-sm hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
