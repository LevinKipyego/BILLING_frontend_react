import { type  FC } from "react";

type ServiceType = "HOTSPOT" | "PPPOE";

interface Vendor {
    id: string;
    name: string;
}

interface Router {
    id: string;
    identity_name: string;
}

interface Plan {
    id: number;
    name: string;
}

interface CustomerFormData {
    full_name: string;
    phone: string;

    vendor: string;
    mikrotik: string;

    plan: string;

    username: string;
    password: string;
}

interface Props {

    service: ServiceType;

    data: CustomerFormData;

    vendors: Vendor[];

    routers: Router[];

    plans: Plan[];

    loading?: boolean;

    onChange: (
        field: keyof CustomerFormData,
        value: string
    ) => void;

    onSubmit: () => void;

    onBack: () => void;

}

const CustomerForm: FC<Props> = ({
    service,
    data,
    vendors,
    routers,
    plans,
    loading,
    onChange,
    onSubmit,
    onBack,
}) => {

    return (

        <div className="space-y-8">

            <div>

                <h2 className="text-2xl font-bold">

                    New {service} Customer

                </h2>

                <p className="mt-2 text-sm text-slate-500">

                    Fill in the customer's information.

                </p>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

                <Input
                    label="Full Name"
                    value={data.full_name}
                    onChange={(v)=>
                        onChange("full_name",v)
                    }
                />

                <Input
                    label="Phone Number"
                    value={data.phone}
                    onChange={(v)=>
                        onChange("phone",v)
                    }
                />

                <Select
                    label="Vendor"
                    value={data.vendor}
                    onChange={(v)=>
                        onChange("vendor",v)
                    }
                    options={vendors.map(v=>({
                        value:v.id,
                        label:v.name,
                    }))}
                />

                <Select
                    label="Router"
                    value={data.mikrotik}
                    onChange={(v)=>
                        onChange("mikrotik",v)
                    }
                    options={routers.map(r=>({
                        value:r.id,
                        label:r.identity_name,
                    }))}
                />

                <Select
                    label="Plan"
                    value={data.plan}
                    onChange={(v)=>
                        onChange("plan",v)
                    }
                    options={plans.map(p=>({
                        value:String(p.id),
                        label:p.name,
                    }))}
                />

                {service==="PPPOE" && (

                    <>

                        <Input
                            label="Username"
                            value={data.username}
                            onChange={(v)=>
                                onChange("username",v)
                            }
                        />

                        <Input
                            label="Password"
                            value={data.password}
                            onChange={(v)=>
                                onChange("password",v)
                            }
                        />

                    </>

                )}

            </div>

            {service==="HOTSPOT" && (

                <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm">

                    Username and password will be automatically generated after the customer purchases a Hotspot package.

                </div>

            )}

            <div className="flex justify-between">

                <button
                    onClick={onBack}
                    className="rounded-xl border px-5 py-3"
                >
                    Back
                </button>

                <button
                    disabled={loading}
                    onClick={onSubmit}
                    className="rounded-xl bg-blue-600 px-6 py-3 text-white"
                >
                    Create Customer
                </button>

            </div>

        </div>

    );

};

export default CustomerForm;

interface InputProps{

    label:string;

    value:string;

    onChange:(v:string)=>void;

}

function Input({
    label,
    value,
    onChange,
}:InputProps){

    return(

        <div>

            <label className="mb-2 block text-sm font-medium">

                {label}

            </label>

            <input

                value={value}

                onChange={(e)=>

                    onChange(e.target.value)

                }

                className="w-full rounded-xl border border-slate-300 px-4 py-3"

            />

        </div>

    );

}

interface SelectProps{

    label:string;

    value:string;

    onChange:(v:string)=>void;

    options:{
        value:string;
        label:string;
    }[];

}

function Select({
    label,
    value,
    onChange,
    options,
}:SelectProps){

    return(

        <div>

            <label className="mb-2 block text-sm font-medium">

                {label}

            </label>

            <select

                value={value}

                onChange={(e)=>

                    onChange(e.target.value)

                }

                className="w-full rounded-xl border border-slate-300 px-4 py-3"

            >

                <option value="">

                    Select...

                </option>

                {options.map(option=>(

                    <option
                        key={option.value}
                        value={option.value}
                    >

                        {option.label}

                    </option>

                ))}

            </select>

        </div>

    );

}