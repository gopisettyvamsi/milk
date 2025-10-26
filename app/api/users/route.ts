// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { withProtection } from "@/utils/withProtection";
import { v4 as uuidv4 } from 'uuid';

// GET endpoint with protection
export const GET = withProtection(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const isActive = searchParams.get("is_active");
  const countOnly = searchParams.get("count"); 

  try {
    if (countOnly === "true") {
      const [{ total }] = await db("users").count("* as total");
      return NextResponse.json({ success: true, count: Number(total) });
    }
    const countQuery = db("users").count("* as total");
    
    if (search) {
      countQuery.where((builder) => {
        builder
          .where("name", "like", `%${search}%`)
          .orWhere("email", "like", `%${search}%`);
        
      });
    }

    if (role && role !== "all") {
      countQuery.andWhere("role", role);
    }

    if (isActive !== null && isActive !== undefined) {
      countQuery.andWhere("is_active", parseInt(isActive));
    }

    const [{ total }] = await countQuery;

    const usersQuery = db("users")
      .select("*")
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy("id", "desc");

    if (search) {
      usersQuery.where((builder) => {
        builder
          .where("name", "like", `%${search}%`)
          .orWhere("email", "like", `%${search}%`);
      });
    }

    if (role && role !== "all") {
      usersQuery.andWhere("role", role);
    }

    if (isActive !== null && isActive !== undefined) {
      usersQuery.andWhere("is_active", parseInt(isActive));
    }

    const users = await usersQuery;

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        total: Number(total),
        page,
        limit,
      },
    });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
});

// POST endpoint with protection
export const POST = withProtection(async (req: NextRequest) => {
  try {
    const userData = await req.json();
   

    const [id] = await db("users").insert({
      name: userData.name,
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10),
      role: userData.role,
      is_active: userData.is_active || 1,
   
      profile: 0,
    });

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      userId: id,
    
    });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
});

// PUT endpoint with protection
export const PUT = withProtection(async (req: NextRequest) => {
  try {
    const userData = await req.json();
    const { id, password, ...updateData } = userData;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await db("users").where({ id }).update(updateData);

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
});

// DELETE endpoint with protection - remains unchanged
export const DELETE = withProtection(async (req: NextRequest) => {
  try {
    const { id } = await req.json();
    await db("users").where({ id }).delete();

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
});