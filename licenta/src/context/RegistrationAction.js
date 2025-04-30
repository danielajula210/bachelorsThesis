export const LoginStart = (loginInfo) => ({
    type: "LOGIN_START",
});

export const LoginSuccessfully = (user) => ({
    type: "LOGIN_SUCCESSFULLY",
    payload: user,
});

export const LoginFailure = (error) => ({
    type: "LOGIN_FAILURE",
    payload: error,
});

export const Logout = () => ({
    type: "LOGOUT",
});

export const Friend=(userId)=>({
    type: "FRIEND",
    payload:userId,
});

export const Unfriend=(userId)=>({
    type: "UNFRIEND",
    payload:userId,
});