export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const posts = await Post.find({ creator: params.id })
    .sort({ createdAt: -1 })
    .populate("creator", "username avatar");

  return NextResponse.json(posts);
}
