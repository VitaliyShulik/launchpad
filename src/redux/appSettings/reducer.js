const initialState = {
  owner: '',
  networksSettings: {},
  idoFactory: '',
  lockerFactory: '',
  feeToken: '',
  webSocketUrl: '',
  infuraIpfsKey: '',
  infuraDedicatedGateway: '',
  projectName: '',
  logo: '',
  navigationLinks: [],
  menuLinks: [],
  socialLinks: [],
  disableSourceCopyright: false,
}

const appDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_APP_SETTINGS_DATA":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default appDataReducer;
