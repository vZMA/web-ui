export const vatsimAuthRedirectUrl = `${getAuthEndpoint()}/oauth/authorize?client_id=${getClientId()}&redirect_uri=${
   "https://zmaartcc.net/login/verify"
   //window.location.origin + "/login/verify"
  }&response_type=code&scope=vatsim_details+full_name+email`;
  
  export const discordRedirectUrl = `https://discord.com/api/oauth2/authorize?client_id=546531280842653696&redirect_uri=https%3A%2F%2Fzmaartcc.net%2Fconnect%2Fdiscord&response_type=code&scope=identify`;
  
  function getClientId() {
    //const ClientId = 1246;
    const ClientId = 1188;
    
  return ClientId;
    
  }
  
  function getAuthEndpoint() {
    const authUrl = "https://auth.vatsim.net";
    
      return authUrl;

  }