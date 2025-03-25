import { NextResponse } from 'next/server';
import User from '../../../../../utils/models/User';
import connectDb from "../../../../../utils/connectDb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await connectDb();
    
//     const { email, password } = await req.json();

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     // Verify password
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     // Generate JWT
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     return NextResponse.json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         role: user.role
//       }
//     });

//   } catch (error) {
//     console.error("Error in login route:", error); // Log error in server console
//     return NextResponse.json(
//       { error: `Server error: ${error.message}` }, // Return error message in response
//       { status: 500 }
//     );
//   }
// }


export async function POST(req) {
  try {
    await connectDb();
    
    const { email, password } = await req.json();

    // Find user (Super Admin or Sub Admin)
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Prepare payload for JWT
    const payload = { id: user._id, role: user.role };

    // If user is a Sub Admin, include the Super Admin's ID
    if (user.role === "sub") {
      payload.superAdminId = user.superAdminId;
    }

    // Generate JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    return NextResponse.json({
      token: token,
      user: {
        id: user._id.toString(),
        name: user.name,
        role: user.role,
        email: user.email,
        ...(user.role === "sub" && { superAdminId: user.superAdminId }) // Add Super Admin ID for Sub Admins
      }
    });

  } catch (error) {
    console.error("Error in login route:", error); // Log error in server console
    return NextResponse.json(
      { error: `Server error: ${error.message}` }, // Return error message in response
      { status: 500 }
    );
  }
}
