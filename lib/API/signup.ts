import api from "./axios";


interface SignupData {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  country: string;
  license_number: string;
  license_details: string;
  description: string;
  password_confirmation: string;

}

export const signup = async (signupData: SignupData) => {
  try {
    const response = await api.post(
      "register/transporter",
      signupData,
      {
        headers: {
          
         
        }
      }
    );
 
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
