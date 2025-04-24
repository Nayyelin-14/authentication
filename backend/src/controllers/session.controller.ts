import { NOT_FOUND, OK } from "../constants/http";
import sessionModel from "../models/session.model";
import { AppAssert } from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";

export const getSessionsHandler = catchErrors(async (req, res) => {
  const sessions = await sessionModel.find(
    {
      userId: req.userId,
      expiresAt: { $gt: new Date() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: {
        createdAt: -1,
      },
    }
  );

  AppAssert(sessions, NOT_FOUND, "Sessions Not Found");
  return res.status(OK).json(
    sessions?.map((session) => ({
      ...session.toObject(), //Converts the Mongoose document into a plain JS object
      ...(session.id === req.sessionId && {
        //session.id === req.sessionId returns true or false.
        // If it's true, then the whole expression becomes { isCurrent: true }.
        // If it's false, then the whole expression becomes false.
        // When you spread false:
        // It gets ignored by the spread operator (...), because spreading false does nothing.
        isCurrent: true,
      }),
    }))
  );
});

export const deleteSessionHandler = catchErrors(async (req, res) => {
  const deletedSession = await sessionModel.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  AppAssert(deletedSession, NOT_FOUND, "Session Not Found");

  return res.status(OK).json({
    message: "Session removed",
  });
});
