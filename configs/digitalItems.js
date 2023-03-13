const uuidv4 = require("uuid").v4;

const User = require("../models/user");
const LicensesList = require("../models/licensesList");

module.exports = {
  digital_items: [
    /*{
            categoryName: 'Kardex Theme Addons',
            categoryId: 'kardex-addons',
            categoryDescription: 'Discord-Dashboard v3 Kardex Theme\'s Addons',
            categoryItems: [
                {
                    id: "kardex-custom-components",
                    name: "Custom Components",
                    description: "Custom Components for Kardex Theme - build your own, unique pages and components!",
                    image: "https://cdn.assistantscenter.com/l6yvtyo6",
                    price: 400,
                    aho: {
                        type: 'modal',
                        html: {
                            content: '',
                        },
                        getInfo: () => '123',
                    },
                    owns_already: ()=>false,
                    assign_item:()=>true,
                },
                {
                    id: "kardex-theme-ui-editor",
                    name: "Theme UI Editor",
                    description: "Allow yourself to change anything you want! Adjust this, and that, and you will achieve your goal - the best theme for your Dashboard!",
                    image: "https://cdn.assistantscenter.com/l6yvtyo6",
                    price: 300,
                    aho: {
                        type: 'modal',
                        html: {
                            content: '',
                        },
                        getInfo: () => '123',
                    },
                    owns_already: ()=>false,
                    assign_item:()=>true,
                },
                {
                    id: "kardex-save-floating-button",
                    name: "Save Floating Button",
                    description: "Better, floating, save button!",
                    image: "https://cdn.assistantscenter.com/l6yvtyo6",
                    price: 50,
                    aho: {
                        type: 'modal',
                        html: {
                            content: '',
                        },
                        getInfo: () => '123',
                    },
                    owns_already: ()=>false,
                    assign_item:()=>true,
                },
            ]
        },*/
    {
      categoryName: "Discord-Dashboard v2 Licenses",
      categoryDescription: "Choose a license you'd like to use.",
      categoryId: "dbd-license",
      categoryItems: [
        {
          id: "dbd_opensource_license",
          image: "https://cdn.assistantscenter.com/l6yvtyo6",
          aho: {
            type: 'modal',
            html: {
              content: `
                                <div className="modal-header">
                                    <h3 className="modal-title" id="exampleModalLabel">OpenSource DBD v2 License</h3>
                                </div>
                                <div className="modal-body">
                                    <p>This license is for the OpenSource DBD v2 project. It is free to use and can be used by anyone.</p>
                                    
                                    <hr/>
                                    
                                    <a id="license"></a>
                                </div>
                            `,
            },
            getInfo: async ({ user_id }) => {
              const user = await User.findOne({ _id: user_id })
              return user?.OpenSource?.license_id
            }
          },
          /*aho: {
               type: 'redirect',
               url: '/discord-dashboard/v2'
           },*/
          name: "OpenSource DBD v2 License",
          description: "This license is for the OpenSource DBD v2 project. It is free to use and can be used by anyone.",
          price: 0,
          owns_already: async ({ user_id }) => {
            const user = await User.findOne({ _id: user_id })
            return user?.OpenSource?.license_id == null ? false : true
          },
          assign_item: async ({ Session }) => {
            const user_id = Session.user._id
            const user = await User.findOne({ _id: user_id })

            const license = uuidv4()
            user.OpenSource = {
              payment_id: 'UNKNOWN',
              license_type: 'opensource',
              status: 'approved',
              license_id: license,
            }
            await user.save()

            await LicensesList.create({
              user: user_id,
              payment_id: 'UNKNOWN',
              license_id: license,
              license_type: 'opensource',
            })

            return true
          },
        },
        {
          id: "dbd_personal_license",
          image: "https://cdn.assistantscenter.com/l6yvtyo6",
          aho: {
            type: 'modal',
            html: {
              content: `
                                <div className="modal-header">
                                    <h3 className="modal-title" id="exampleModalLabel">Personal DBD v2 License</h3>
                                </div>
                                <div className="modal-body">
                                    <p>This license is for the Personal DBD v2 project. It allows profit-making from the project.</p>
                                    
                                    <hr/>
                                    
                                    <a id="license"></a>
                                </div>
                            `,
            },
            getInfo: async ({ user_id }) => {
              const user = await User.findOne({ _id: user_id })
              return user?.Personal?.license_id
            }
          },
          /*aho: {
              type: 'redirect',
              url: '/discord-dashboard/v2'
          },*/
          name: "Personal DBD v2 License",
          description: "This license is for the Personal DBD v2 project. It allows profit-making from the project.",
          price: 1000,
          owns_already: async ({ user_id }) => {
            const user = await User.findOne({ _id: user_id })
            return user?.Personal?.license_id == null ? false : true
          },
          assign_item: async ({ Session }) => {
            const user_id = Session.user._id
            const user = await User.findOne({ _id: user_id })

            const license = uuidv4()
            user.Personal = {
              payment_id: 'UNKNOWN',
              license_type: 'personal',
              status: 'approved',
              license_id: license,
            }
            await user.save()

            await LicensesList.create({
              user: user_id,
              payment_id: 'UNKNOWN',
              license_id: license,
              license_type: 'personal',
            })

            return true
          }
        },
        {
          id: "dbd_production_license",
          image: "https://cdn.assistantscenter.com/l6yvtyo6",
          aho: {
            type: 'modal',
            html: {
              content: `
                                <div className="modal-header">
                                    <h3 className="modal-title" id="exampleModalLabel">Production DBD v2 License</h3>
                                </div>
                                <div className="modal-body">
                                    <p>This license is for the Personal DBD v2 project. It allows profit-making from the project. It can be shared with friends.</p>
                                    
                                    <hr/>
                                    
                                    <a id="license"></a>
                                </div>
                            `,
            },
            getInfo: async ({ user_id }) => {
              const user = await User.findOne({ _id: user_id })
              return user?.Production?.license_id
            }
          },
          /*aho: {
              type: 'redirect',
              url: '/discord-dashboard/v2'
          },*/
          name: "Production DBD v2 License",
          description: "This license is for the Personal DBD v2 project. It allows profit-making from the project. It can be shared with friends.",
          price: 10000,
          owns_already: async ({ user_id }) => {
            const user = await User.findOne({ _id: user_id })
            return user?.Production?.license_id == null ? false : true
          },
          assign_item: async ({ Session }) => {
            const user_id = Session.user._id
            const user = await User.findOne({ _id: user_id })

            const license = uuidv4()
            user.Production = {
              payment_id: 'UNKNOWN',
              license_type: 'production',
              status: 'approved',
              license_id: license,
            }
            await user.save()

            await LicensesList.create({
              user: user_id,
              payment_id: 'UNKNOWN',
              license_id: license,
              license_type: 'production',
            })

            return true
          }
        }
      ]
    },
    {
      categoryName: "Soft-UI Addons",
      categoryDescription: "Soft-UI Theme Addons for Discord-Dashboard v2.",
      categoryId: "soft-ui-addons",
      categoryItems: []
     },
    /*{
      categoryName: "Soft-UI Addons",
      categoryDescription: "Soft-UI Theme Addons for Discord-Dashboard v2.",
      categoryId: "soft-ui-addons",
      categoryItems: [
        {
          id: "sui_addon_leaderboard",
          addonPath: "leaderboardPage",
          addonVersion: 1.0,
          image: "https://cdn.assistantscenter.com/l6yvtyo6",
          aho: {
            type: "modal",
            html: {
              content: `
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Leaderboard Page</h5>
                        </div>
                        <div className="modal-body">
                            <p>Leaderboard Page is an addon for Soft-UI. It allows you to add a leaderboard page to your dashboard.</p>
                            <div style="text-align: center;">
                                <img src="https://imgur.com/MLzdWHV.png" style="max-height: 250px; border-radius: 10px;" className="img-fluid" alt="Leaderboard Preview" />
                            </div>
                        </div>
                    `,
            },
            getInfo: async ({ user_id }) => {
              const user = await User.findOne({ _id: user_id });

              const license = user.productLicenses.find(
                (license) => license.itemID == "sui_addon_leaderboard"
              ).licenseID;

              return license || "No license found.";
            },
          },
          name: "Leaderboard Addon",
          description:
            "This license is for the OpenSource DBD v2 project. It is free to use and can be used by anyone.",
          price: 100,
          owns_already: async ({ user_id }) => {
            const user = await User.findOne({ _id: user_id });

            const licenseItem = user.productLicenses.find(
              (l) => l.itemID === "sui_addon_leaderboard"
            );

            if (licenseItem) return true;

            if (
              user.Production?.license_id ||
              user.Personal?.license_id
            ) {
              const license = uuidv4();
              user.productLicenses.push({
                itemID: "sui_addon_leaderboard",
                licenseID: license,
              });
              await user.save();

              await LicensesList.create({
                user: user_id,
                payment_id: "UNKNOWN",
                license_id: license,
                license_type: "sui_addon_leaderboard",
              });

              return true;
            }

            return false;
          },
          assign_item: async ({ Session }) => {
            const user_id = Session.user._id;
            const user = await User.findOne({ _id: user_id });

            const license = uuidv4();
            user.productLicenses.push({
              itemID: "sui_addon_leaderboard",
              licenseID: license,
            });
            await user.save();

            await LicensesList.create({
              user: user_id,
              payment_id: "UNKNOWN",
              license_id: license,
              license_type: "sui_addon_leaderboard",
            });

            return true;
          },
        },
        {
          id: "sui_addon_profile",
          addonPath: "profilePage",
          addonVersion: 1.0,
          image: "https://cdn.assistantscenter.com/l6yvtyo6",
          aho: {
            type: "modal",
            html: {
              content: `
                      <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">Leaderboard Page</h5>
                      </div>
                      <div className="modal-body">
                          <p>Leaderboard Page is an addon for Soft-UI. It allows you to add a leaderboard page to your dashboard.</p>
                          <div style="text-align: center;">
                              <img src="https://imgur.com/MLzdWHV.png" style="max-height: 250px; border-radius: 10px;" className="img-fluid" alt="Leaderboard Preview" />
                          </div>
                          <p id="license"></p>
                      </div>
                    `,
            },
            getInfo: async ({ user_id }) => {
              const user = await User.findOne({ _id: user_id });

              const license = user.productLicenses.find(
                (license) => license.itemID == "sui_addon_profile"
              ).licenseID;

              return license || "No License found.";
            },
          },
          name: "Profile Page Addon",
          description:
            "This license is for the OpenSource DBD v2 project. It is free to use and can be used by anyone.",
          price: 100,
          owns_already: async ({ user_id }) => {
            const user = await User.findOne({ _id: user_id });

            const licenseItem = user.productLicenses.find(
              (l) => l.itemID === "sui_addon_profile"
            );

            if (licenseItem) return true;

            if (
              user.Production?.license_id ||
              user.Personal?.license_id
            ) {
              const license = uuidv4();
              user.productLicenses.push({
                itemID: "sui_addon_profile",
                licenseID: license,
              });

              await user.save();

              await LicensesList.create({
                user: user_id,
                payment_id: "UNKNOWN",
                license_id: license,
                license_type: "sui_addon_profile",
              });

              return true;
            }

            return false;
          },
          assign_item: async ({ Session }) => {
            const user_id = Session.user._id;
            const user = await User.findOne({ _id: user_id });

            const license = uuidv4();
            user.productLicenses.push({
              itemID: "sui_addon_profile",
              licenseID: license,
            });
            await user.save();

            await LicensesList.create({
              user: user_id,
              payment_id: "UNKNOWN",
              license_id: license,
              license_type: "sui_addon_profile",
            });

            return true;
          }
        }
      ]
    }*/
  ]
}
