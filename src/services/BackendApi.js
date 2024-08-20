
const getBaseUrl = () => {
    const backendIP = localStorage.getItem("backendIP");
    const protocol =sessionStorage.getItem("protocol");
    // const port =sessionStorage.getItem("port")
    return backendIP ? `http://${backendIP}:81/` : "http://localhost:81/";
  };
  

  export default getBaseUrl