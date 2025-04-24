import { NOT_FOUND, OK } from "../constants/http";
import UserModal from "../models/user.model";
import { AppAssert } from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModal.findById(req.userId);
  AppAssert(user, NOT_FOUND, "User Not Found");
  return res.status(OK).json({
    user: user.omitPassword(),
  });
});
