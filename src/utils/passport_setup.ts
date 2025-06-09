import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../user/model/user_model';
import AuthService from 'user/service/auth_service';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google profile:', profile);
        const googleId = profile.id;
        const email = profile.emails?.[0].value;

        let user = await User.findOne({
          $or: [{ googleId }, { email }],
        });

        if (!user) {
          user = new User({
            googleId,
            name: profile.displayName,
            email,
            role: 'user',
          });
          await user.save();
        }

        console.log('User found or created:', user);

        // Only pass the user to done, not tokens!
        done(null, user);
      } catch (error) {
        console.error('Error in GoogleStrategy:', error);
        return done(error);
      }
    },
  ),
);

// Serialize only the user ID
passport.serializeUser((user: any, done: any) => {
  done(null, user._id);
});

// Deserialize by looking up the user by ID
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error: any) {
    done(error, null);
  }
});

export default passport;
