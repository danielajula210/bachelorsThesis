const RegistrationReducer = (state, action) => {
    switch(action.type){
        case "LOGIN_START":
            return{
                user:null,
                isFetching:true,
                error:false,
            };
        case "LOGIN_SUCCESSFULLY":
            return{
                user:action.payload,
                isFetching:false,
                error:false,
            };   
        case "LOGIN_FAILURE":
            return{
                user:null,
                isFetching:false,
                error:action.payload,
            }; 
        default:
            return state;
    }
};

export default RegistrationReducer;