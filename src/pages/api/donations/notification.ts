import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "~/server/db";
// import { prisma } from "~/server/db";

interface QueryProps {
  campaignId: string;
  userId?: string;
  amount: string;
  ["data.id"]: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const query = req.query as unknown as QueryProps;
    const { campaignId, userId, amount } = query;
    await prisma.donation.create({
      data: {
        amount: parseInt(amount),
        paymentId: query["data.id"],
        campaign: {
          connect: {
            id: campaignId,
          },
        },
        ...(userId
          ? {
              user: {
                connect: {
                  id: userId,
                },
              },
            }
          : {}),
      },
    });
    const campaign = await prisma.donationCampaign.findUnique({
      where: {
        id: campaignId,
      },
      select: {
        currentAmount: true,
        amountGoal: true,
      },
    });
    if (!campaign) {
      return res.status(404).json({
        error: "Campaña no encontrada",
      });
    }

    await prisma.donationCampaign.update({
      where: {
        id: campaignId,
      },
      data: {
        currentAmount: {
          increment: parseInt(amount),
        },
        status:
          campaign.currentAmount + parseInt(amount) >= campaign.amountGoal
            ? "FINISHED"
            : "ACTIVE",
      },
    });
    if (userId) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          discountAmount: {
            increment: parseInt(amount),
          },
        },
      });
    }

    return res.status(200).json({});
  }
}
