import DashboardLayout from "../components/layouts/DashboardLayout";
import InputField from "../components/commom/InputField";
import Button from "../components/commom/Button";

export default function Onboarding() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Vendor Onboarding</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Vendor Name" placeholder="Vendor Name" />
        <InputField label="NAS IP" placeholder="e.g., 192.168.1.1" />
        <InputField label="Mikrotik Device" placeholder="Mikrotik ID" />
        <InputField label="Plan Name" placeholder="Plan Name" />
        <InputField label="Plan Price" placeholder="100" />
        <InputField label="Plan Duration (minutes)" placeholder="60" />
        <div className="col-span-1 md:col-span-2">
          <Button type="submit">Submit Onboarding</Button>
        </div>
      </form>
    </DashboardLayout>
  );
}
