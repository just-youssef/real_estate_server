import validator from "../utils/changePassword.validator.js";

const ChangePasswordValidatorMW =  (req, res, nxt) => {
    let valid = validator(req.body);

    if (!valid) {
        let error_messages = {}
        for (let error of validator.errors){
            if(error.keyword == "required"){
                error_messages[error.params.missingProperty] = error.message
            } else{
                error_messages[error.instancePath.split("/")[1]] = error.message
            }
        }

        console.log(error_messages);
        return res.status(403).json({ error: error_messages });
    }

    req.valid = 1;
    nxt();
}

export default ChangePasswordValidatorMW;