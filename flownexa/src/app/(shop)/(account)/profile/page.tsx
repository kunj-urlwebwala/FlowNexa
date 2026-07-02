"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, MapPin, Edit3 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
});

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Phone number is required"),
  addressLine1: z.string().min(5, "Street address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Region is required"),
  zipCode: z.string().min(4, "ZIP/Postal code is required"),
  country: z.string().min(2, "Country is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type AddressFormData = z.infer<typeof addressSchema>;

export default function ProfilePage() {
  const { user, updateProfile, addAddress, deleteAddress, setDefaultAddress } = useAuthStore();
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    },
  });

  // Sync form inputs when user profile async loads
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
        phone: user.phone || "",
      });
    }
  }, [user, resetProfile]);

  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    reset: resetAddress,
    formState: { errors: addressErrors, isSubmitting: isAddressSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: "United States",
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    await updateProfile(data);
  };

  const onAddressSubmit = async (data: AddressFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    addAddress({ ...data, isDefault: false });
    resetAddress();
    setIsAddressOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 text-white font-sans">
      
      {/* Edit Profile Info */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8">
        <h2 className="text-lg font-bold font-heading mb-6 border-b border-white/5 pb-4">
          Personal Information
        </h2>

        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="flex flex-col gap-5 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="prof-name" className="text-xs font-semibold">Full Name</Label>
              <Input
                {...registerProfile("name")}
                id="prof-name"
                className="rounded-xl bg-flownexa-black border-white/10 h-11 text-sm"
              />
              {profileErrors.name && (
                <span className="text-xs text-red-400">{profileErrors.name.message}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="prof-phone" className="text-xs font-semibold">Phone Number</Label>
              <Input
                {...registerProfile("phone")}
                id="prof-phone"
                className="rounded-xl bg-flownexa-black border-white/10 h-11 text-sm"
              />
              {profileErrors.phone && (
                <span className="text-xs text-red-400">{profileErrors.phone.message}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-muted-foreground">Email Address (Cannot change)</Label>
            <Input
              type="email"
              disabled
              value={user?.email || ""}
              className="rounded-xl bg-flownexa-black/50 border-white/5 h-11 text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>

          <Button
            type="submit"
            disabled={isProfileSubmitting}
            className="rounded-full h-11 bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover mt-2 w-full sm:w-[160px] shadow-lg shadow-flownexa-lime/10"
          >
            {isProfileSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>

      {/* Shipping Address book */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
          <h2 className="text-lg font-bold font-heading">
            Addresses & Shipping
          </h2>

          <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 gap-1.5 font-semibold text-xs py-4 px-3"
              >
                <Plus size={14} />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-flownexa-black border border-white/10 text-white rounded-2xl max-w-lg font-sans">
              <DialogHeader className="pb-4 border-b border-white/5">
                <DialogTitle className="text-white text-left font-bold font-heading text-lg flex items-center gap-2">
                  <MapPin size={18} className="text-flownexa-lime" />
                  Add Shipping Address
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="flex flex-col gap-4 py-4 max-h-[75vh] overflow-y-auto pr-1 scrollbar-thin">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="addr-name" className="text-xs font-semibold">Recipient Name</Label>
                    <Input {...registerAddress("fullName")} id="addr-name" className="rounded-xl bg-zinc-900 border-white/10 h-10 text-xs" />
                    {addressErrors.fullName && <span className="text-[10px] text-red-400">{addressErrors.fullName.message}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="addr-phone" className="text-xs font-semibold">Contact Phone</Label>
                    <Input {...registerAddress("phone")} id="addr-phone" className="rounded-xl bg-zinc-900 border-white/10 h-10 text-xs" />
                    {addressErrors.phone && <span className="text-[10px] text-red-400">{addressErrors.phone.message}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="addr-line1" className="text-xs font-semibold">Street Address</Label>
                  <Input {...registerAddress("addressLine1")} id="addr-line1" className="rounded-xl bg-zinc-900 border-white/10 h-10 text-xs" />
                  {addressErrors.addressLine1 && <span className="text-[10px] text-red-400">{addressErrors.addressLine1.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="addr-line2" className="text-xs font-semibold">Apt, Unit, Suite (Optional)</Label>
                  <Input {...registerAddress("addressLine2")} id="addr-line2" className="rounded-xl bg-zinc-900 border-white/10 h-10 text-xs" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="addr-city" className="text-xs font-semibold">City</Label>
                    <Input {...registerAddress("city")} id="addr-city" className="rounded-xl bg-zinc-900 border-white/10 h-10 text-xs" />
                    {addressErrors.city && <span className="text-[10px] text-red-400">{addressErrors.city.message}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="addr-state" className="text-xs font-semibold">State / Region</Label>
                    <Input {...registerAddress("state")} id="addr-state" className="rounded-xl bg-zinc-900 border-white/10 h-10 text-xs" />
                    {addressErrors.state && <span className="text-[10px] text-red-400">{addressErrors.state.message}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="addr-zip" className="text-xs font-semibold">Postal Code</Label>
                    <Input {...registerAddress("zipCode")} id="addr-zip" className="rounded-xl bg-zinc-900 border-white/10 h-10 text-xs" />
                    {addressErrors.zipCode && <span className="text-[10px] text-red-400">{addressErrors.zipCode.message}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="addr-country" className="text-xs font-semibold">Country</Label>
                  <Input {...registerAddress("country")} id="addr-country" className="rounded-xl bg-zinc-900 border-white/10 h-10 text-xs" />
                  {addressErrors.country && <span className="text-[10px] text-red-400">{addressErrors.country.message}</span>}
                </div>

                <Button
                  type="submit"
                  disabled={isAddressSubmitting}
                  className="rounded-full h-11 bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover mt-4 w-full"
                >
                  {isAddressSubmitting ? "Saving Address..." : "Add Shipping Address"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Address cards list */}
        {user?.addresses && user.addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr) => (
              <Card key={addr.id} className="bg-flownexa-black border border-white/5 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-full">
                
                <div>
                  <div className="flex justify-between items-center gap-2 mb-3">
                    <p className="font-bold text-sm text-white">{addr.fullName}</p>
                    {addr.isDefault && (
                      <span className="text-[9px] bg-flownexa-lime-muted text-flownexa-lime font-extrabold px-2 py-0.5 rounded-full border border-flownexa-lime/25 uppercase tracking-wide">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {addr.addressLine1}
                    {addr.addressLine2 && `, ${addr.addressLine2}`}
                    <br />
                    {addr.city}, {addr.state} {addr.zipCode}
                    <br />
                    {addr.country}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3 font-semibold">Phone: {addr.phone}</p>
                </div>

                <div className="flex items-center gap-3 mt-5 pt-3 border-t border-white/5">
                  {!addr.isDefault && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-[10px] font-bold text-flownexa-lime hover:bg-white/5 p-0 h-auto"
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAddress(addr.id)}
                    className="size-8 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-400 ml-auto cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="border border-white/5 bg-flownexa-black p-8 rounded-2xl text-center flex flex-col items-center">
            <MapPin size={22} className="text-muted-foreground mb-2" />
            <p className="text-sm font-semibold text-white">No shipping address recorded</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
              Add a shipping address to speed up your checkout process.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
