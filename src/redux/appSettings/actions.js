const setAppSettingsData = (payload) => {
  return {
    type: "SET_APP_SETTINGS_DATA",
    payload,
  };
};

export const setAppSettigns = (appSettings) => (dispatch) => {
  dispatch(setAppSettingsData(appSettings));
};
