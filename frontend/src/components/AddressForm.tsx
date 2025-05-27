import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { getUserAddress } from "@/services/userServices";
import { Address } from "@/types/userTypes";

interface AddressFormProps {
  onSelectAddress: Dispatch<SetStateAction<string | null>>;
}

export default function AddressForm({ onSelectAddress }: AddressFormProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user_uuid = localStorage.getItem("user_uuid");
    const authToken = localStorage.getItem("token");

    console.log("user_uuid:", user_uuid);
    console.log("authToken:", authToken);

    if (!user_uuid || !authToken) {
      setError("Usuário ou token de autenticação não encontrados.");
      setLoading(false);
      return;
    }

    const fetchAddress = async () => {
      try {
        const data = await getUserAddress(user_uuid); // This likely returns a single address or needs adjustment if it returns multiple
        // Assuming getUserAddress returns a single address object or an array
        // If it's a single address, and you want to allow selection from multiple, this logic needs to change
        // For now, let's assume it might return an array or we adapt to a single one
        if (Array.isArray(data)) {
          setAddresses(data);
          if (data.length > 0) {
            setSelectedAddress(data[0]); // Auto-select the first address
            onSelectAddress(data[0].uuid); // Notify parent
          }
        } else if (data) {
          setAddresses([data]);
          setSelectedAddress(data);
          onSelectAddress(data.uuid);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao buscar o endereço.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow mb-4">
      <h2 className="font-bold text-lg mb-4">Endereço para entrega</h2>

      {loading ? (
        <p className="text-gray-500">Carregando endereço...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : addresses.length > 0 ? (
        // If multiple addresses, implement a selection mechanism (e.g., radio buttons)
        // For simplicity, this example just displays the first one or the selected one.
        // You might want a dropdown or list if addresses can be multiple.
        addresses.map(addr => (
          <div key={String(addr.uuid)} 
               onClick={() => {
                 setSelectedAddress(addr);
                 onSelectAddress(addr.uuid ? String(addr.uuid) : null);
               }}
               className={`p-2 border rounded cursor-pointer ${
                selectedAddress?.uuid === addr.uuid ? 'border-orange-500' : 'border-gray-300'
               }`}>
            <p>
              {addr.street}, {addr.number}
            </p>
            <p>
              {addr.neighborhood}, {addr.city} - {addr.state}
            </p>
            <p>{addr.postalCode}</p>
            <p>{addr.country}</p>
            {addr.complement && <p>{addr.complement}</p>}
          </div>
        ))
      ) : (
        <p className="text-gray-500">Nenhum endereço encontrado. Por favor, adicione um endereço.</p>
      )}
      {/* TODO: Add a button or link to add/manage addresses */}
    </div>
  );
}
