import { useEffect, useState } from "react";
import { getUserAddress } from "@/services/userServices";
import { Address } from "@/types/userTypes";

export default function AddressForm() {
  const [address, setAddress] = useState<Address | null>(null);
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
        const data = await getUserAddress(user_uuid);
        setAddress(data);
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
      ) : address ? (
        <div className="space-y-2 text-gray-700">
          <p>
            {address.street}, {address.number}
          </p>
          <p>
            {address.neighborhood}, {address.city} - {address.state}
          </p>
          <p>{address.postalCode}</p>
          <p>{address.country}</p>
          {address.complement && <p>{address.complement}</p>}
        </div>
      ) : (
        <p className="text-gray-500">Endereço não encontrado.</p>
      )}
    </div>
  );
}
