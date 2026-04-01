export const getCustomerById = async (idNumber) => {
  const loginUser = useUser();
  if (!idNumber || idNumber.length < 3) return null;
  try {
    const res = await fetch(
      `http://182.71.135.110:82/api/resource/Customer/${idNumber}`,
      {
        method: 'GET',
        headers: { 
          "Content-Type": "application/json",
          Authorization: `token ${loginUser?.user?.api_key}:${loginUser?.user?.api_secret}`, 
        }
      }
    );
    
    if (!res.ok) {
      console.log('Customer not found');
      return null;
    }
    
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
};
