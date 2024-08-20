
const getBaseUrl = () => {
    const backendIP = sessionStorage.getItem("backendIP");
    return backendIP ? `https://${backendIP}/` : "http://localhost:81/";
  };
  

  export default getBaseUrl