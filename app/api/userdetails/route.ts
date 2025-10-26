import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// ✅ GET user details for specific user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userDetails = await db("user_details").where("user_id", userId).first();

    if (!userDetails) {
      return NextResponse.json({ error: "User details not found" }, { status: 404 });
    }

    return NextResponse.json(userDetails);
  } catch (error: any) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: "Failed to fetch user details" }, { status: 500 });
  }
}

// ✅ POST - Create or update user details
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userId = formData.get("user_id") as string;
    const prefix = formData.get("prefix") as string;
    const other_prefix = formData.get("other_prefix") as string;
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const specialization = formData.get("specialization") as string;
    const designation = formData.get("designation") as string;
    const phonenumber = formData.get("phonenumber") as string;
    const qualification = formData.get("qualification") as string;
    const address = formData.get("address") as string;
    const state = formData.get("state") as string;
    const nationality = formData.get("nationality") as string;
    const college_hospital = formData.get("college_hospital") as string;
    const category = formData.get("category") as string;
    const achievements = formData.get("achievements") as string;
    const bio_details = formData.get("bio_details") as string;
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!firstname || !lastname) {
      return NextResponse.json(
        { error: "Missing required fields: firstname and lastname are required" },
        { status: 400 }
      );
    }

    const userData = {
      prefix: prefix || null,
      other_prefix: other_prefix || null,
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      specialization: specialization || null,
      designation: designation || null,
      phonenumber: phonenumber || null,
      qualification: qualification || null,
      address: address || null,
      state: state || null,
      nationality: nationality || null,
      college_hospital: college_hospital || null,
      category: category || null,
      achievements: achievements || null,
      bio_details: bio_details || null,
    };

    const existingUser = await db("user_details").where("user_id", userId).first();
    // let userUpdate = { profile: 1 };
    // if(userData.firstname || userData.lastname) {


    // let name = (userData.firstname && userData.lastname)? (userData.firstname +' '+ userData.lastname): ()
    // }
    if (existingUser) {
      // ✅ Update record
      await db("user_details").where("user_id", userId).update(userData);

      // ✅ Mark profile as complete
      const fullName = [userData.firstname, userData.lastname].filter(Boolean).join(" ");
      if (fullName) {
        await db("users").where("id", userId).update({ profile: 1, name: fullName });
      } else {
        await db("users").where("id", userId).update({ profile: 1 });
      }
      const updatedUser = await db("user_details").where("user_id", userId).first();

      return NextResponse.json({
        message: "User details updated successfully",
        user: updatedUser,
        profile: 1, // ✅ Return this so frontend knows immediately
      });
    } else {
      // ✅ Insert new record
      const maxIdResult = await db("user_details").max("id as maxId").first();
      const nextId = (maxIdResult?.maxId || 0) + 1;
      const newUserDetail = {
        id: nextId,
        user_id: userId,
        ...userData,
        created_at: new Date(),
      };
      

      await db("user_details").insert(newUserDetail);
      // await db("users").where("id", userId).update(userUpdate);

      const fullName = [userData.firstname, userData.lastname].filter(Boolean).join(" ");
      if (fullName) {
        await db("users").where("id", userId).update({ profile: 1, name: fullName });
      } else {
        await db("users").where("id", userId).update({ profile: 1 });
      }

      const createdUser = await db("user_details").where("user_id", userId).first();

      return NextResponse.json(
        {
          message: "User details added successfully",
          user: createdUser,
          profile: 1, // ✅ Send updated profile flag
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Error creating/updating user details:", error);
    return NextResponse.json(
      { error: "Failed to insert or update user details", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ PUT - Update user details (used if editing)
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    const userId = formData.get("user_id") as string;
    const prefix = formData.get("prefix") as string;
    const other_prefix = formData.get("other_prefix") as string;
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const specialization = formData.get("specialization") as string;
    const designation = formData.get("designation") as string;
    const phonenumber = formData.get("phonenumber") as string;
    const qualification = formData.get("qualification") as string;
    const address = formData.get("address") as string;
    const state = formData.get("state") as string;
    const nationality = formData.get("nationality") as string;
    const college_hospital = formData.get("college_hospital") as string;
    const category = formData.get("category") as string;
    const achievements = formData.get("achievements") as string;
    const bio_details = formData.get("bio_details") as string;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const existingUser = await db("user_details").where("user_id", userId).first();

    if (!existingUser) {
      return NextResponse.json({ error: "No user details found to update" }, { status: 404 });
    }

    const updateData: any = {
      prefix: prefix.trim(),
      other_prefix: other_prefix.trim(),
      firstname: firstname?.trim(),
      lastname: lastname?.trim(),
      specialization: specialization || null,
      designation: designation || null,
      phonenumber: phonenumber || null,
      qualification: qualification || null,
      address: address || null,
      state: state || null,
      nationality: nationality || null,
      college_hospital: college_hospital || null,
      category: category || null,
      achievements: achievements || null,
      bio_details: bio_details || null,
    };

    await db("user_details").where("user_id", userId).update(updateData);

    // ✅ Ensure users.profile = 1 after successful update
    await db("users").where("id", userId).update({ profile: 1 });

    const updatedUserDetail = await db("user_details").where("user_id", userId).first();

    return NextResponse.json({
      message: "User details updated successfully",
      user: updatedUserDetail,
      profile: 1, // ✅ So frontend can immediately hide the toast
    });
  } catch (error: any) {
    console.error("Error updating user details:", error);
    return NextResponse.json(
      { error: "Failed to update user details", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE user details
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const result = await db("user_details").where("user_id", userId).delete();

    if (result === 0) {
      return NextResponse.json({ error: "User details not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User details deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting user details:", error);
    return NextResponse.json({ error: "Failed to delete user details" }, { status: 500 });
  }
}