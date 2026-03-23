export const getCustomerById = async (idNumber) => {
  if (!idNumber || idNumber.length < 3) return null;
  try {
    const res = await fetch(
      `http://192.168.101.182:81/api/resource/Customer/${idNumber}`,
      {
        method: 'GET',
        headers: { Authorization: 'token 661457e17b8612a:32a5ddcc5a9c177' }
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
