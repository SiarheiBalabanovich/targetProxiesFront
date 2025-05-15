// import axios from "axios";

// import { subscriptionListProps } from "src/core/models/interfaces";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// export const getActiveSubscription = async (
//   token: string,
//   id: number,
//   offset: number,
//   limit?: number,
// ): Promise<subscriptionListProps> => {
//   const response = await axios.get(
//     `${API_BASE_URL}/subscription/customer/list?user_id=${id}&offset=${offset}&limit=${limit ? limit : "10"}`,
//     {
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );

//   return response.data as subscriptionListProps;
// };
import { subscriptionListProps } from "src/core/models/interfaces";

export const getActiveSubscription = async (
  token: string,
  id: number,
  offset: number,
  limit?: number
): Promise<subscriptionListProps> => {
  void token;
  void offset;
  void limit;

  // ✅ Возвращаем подписку только для userId === 1, 2 или 3
  if ([1, 2, 3].includes(id)) {
    return {
      total: 1,
      subscriptions: [
        {
          order_id: 1,
          payment_per_period: 25,
          payment_data: {
            brand: "mastercard",
            last4: "1234",
            exp_month: 12,
            exp_year: 2026,
          },
          period_str: "1 week",
          due_date: "13/05/25",
          expires: 5,
          subscription_id: 1,
          subscription_item_id: 101,
          auto_extend: true,
        },
      ],
    };
  }

  // 🛑 Все остальные получают пустой список подписок
  return {
    total: 0,
    subscriptions: [],
  };
};

