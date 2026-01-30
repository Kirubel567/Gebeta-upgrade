import  Business  from "../../models/Business.js";
import { MenuItem } from "../../models/MenuItem.js";

export const getCampusContext = async () => {
  //fetch all businesses and all menu items
  const [businesses, menuItems] = await Promise.all([
    Business.find().lean(),
    MenuItem.find({ isAvailable: true }).lean(),
  ]);

  //format the business and menu items into a context object
  const businessSection = businesses
    .map(
      (b) =>
        `Business: ${b.name} | Category: ${b.category} | Location: ${b.location.adress} | Rating: ${b.rating.average}/5`,
    )
    .join("\n");

  const menuSection = menuItems
    .map(
      (item) =>
        `Item: ${item.name} | Price: ${item.price} | Description: ${item.description} | Business: ${item.business.name || "N/A"}`,
    )
    .join("\n");

  return `
        ${businessSection}
        ${menuSection}
    `;
};
