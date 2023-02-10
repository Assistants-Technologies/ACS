let randomStuff = ["73563g", "23674a", "a73hfvb", "467dgvv54hs"];
let justIncaseLicense = [
  "{{ADDON1}}",
  "{{ADDON2}}",
  "{{ADDON3}}",
  "{{ADDON4}}",
  "{{ADDON5}}",
];
const ejs = require("ejs");

module.exports = {
  name: "{{ADDON_NAME}}",
  license: "{{ADDON_LICENSE}}",
  version: "{{ADDON_VERSION}}",
  initialise: async (themeConfig, dbdConfig, app, messages) => {
    // const licenseInfo = require('discord-dashboard').licenseInfo();
    // if(randomStuff[0] === '73563g' && licenseInfo.licenseId === module.exports.license && module.exports.license === ("{{ADDON_LICENSE1}}" + "{{ADDON_LICENSE2}}")) {
    if (
      module.exports.license === "{{ADDON_LICENSE}}" &&
      justIncaseLicense.join("-") === "{{ADDON_LICENSE}}"
    ) {
      if (module.exports.license === justIncaseLicense.join("-")) {
        app.post("/leaderboard/reset/", async (req, res) => {
          if (!req.session?.user) return res.sendStatus(401);
          if (!dbdConfig.ownerIDs.includes(req.session.user.id)) return res.sendStatus(403);

          const { guildId, userId } = req.body;

          if (!guildId || !userId) return res.sendStatus(412)
  
          if (!themeConfig.leaderboard)
              return res.send({
                  error: true,
                  message: "Leaderboard is disabled.",
              })
  
          if (!themeConfig.leaderboard.resetUser)
              return res.send({
                  error: true,
                  message: "Leaderboard reset is disabled.",
              })
  
          await themeConfig.leaderboard.resetUser({ guildId, userId })
  
          res.send({ error: false, message: "Leaderboard reset." })
        });

        app.get("/leaderboard/:guildId/", async function (req, res) {
          if (!themeConfig.leaderboard) return res.redirect("/");

          const template = `
          <!--
          =========================================================
          * Now UI Dashboard - v1.5.0
          =========================================================
    
          * Product Page: https://www.creative-tim.com/product/now-ui-dashboard
          * Copyright 2019 Creative Tim (http://www.creative-tim.com)
    
          * Designed by www.invisionaleaderboard.com Coded by www.creative-tim.com
    
          =========================================================
    
          * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    
          -->
          <!DOCTYPE html>
          <html lang="en">
    
          <head>
            ${await ejs.renderFile(`${__dirname}/../views/partials/preloader.ejs`, {now: 'leaderboard', req, res, themeConfig})}
            <style>
            .placement-div {
              justify-content: center !important;
              align-self: center;
              width: 2.4rem;
              height: 2.4rem;
              border-radius: 50%;
              place-items: center;
              color: white;
            }
        
            .one {
              background-image: linear-gradient(310deg, #7928CA 0%, #FF0080 100%);
            }
        
            .two {
              background-image: linear-gradient(310deg, rgb(0, 41, 184) 0%, rgb(2, 150, 184) 100%);
            }
        
            .three {
              background-image: linear-gradient(310deg, rgb(16, 18, 31) 0%, rgb(46, 52, 89) 100%);
            }
        
            .name-content {
              align-self: center;
              flex-wrap: wrap;
            }
        
            .level-bar {
              margin-top: 6px;
              flex-basis: 100%;
              width: 400px;
              margin-top: 10px;
              margin-left: 55px;
            }
        
            .end-col {
              display: flex;
              gap: 30px;
            }
        
            div[role="progressbars"] {
              --size: 12rem;
              --fg: #958c80;
              --bg: #232627;
              width: 50px;
              height: 50px;
              align-content: center;
              font-size: .6rem;
              text-align: center;
              border-radius: 50%;
              display: grid;
              place-items: center;
              background:
                radial-gradient(closest-side, #1b1e1f 80%, transparent 0 101%),
                conic-gradient(#f90183 calc(var(--value) * 0.5%), #7d27c8 calc(var(--value) * 1%), var(--bg) 0);
              font-family: Helvetica, Arial, sans-serif;
              color: var(--fg);
            }
        
            div[role="progressbars"]::after {
              counter-reset: percentage var(--level);
              content: counter(percentage);
              white-space: pre-wrap;
            }
            div[role="progressbars"]::before {
              content: "Level";
              color: #9b9285;
              font-weight: 600;
              white-space: pre-wrap;
            }
          </style>
          </head>
    
          <body class="g-sidenav-show bg-gray-100" id="scroll">
          ${await ejs.renderFile(`${__dirname}/../views/partials/preload.ejs`, {req, res, themeConfig})}
          ${await ejs.renderFile(`${__dirname}/../views/partials/sidebar.ejs`, {req, res, themeConfig, config: dbdConfig, now: 'leaderboard'})}
          <div class="main-content position-relative bg-gray-100 max-height-vh-100 h-100">
              <!-- Navbar -->
              ${await ejs.renderFile(`${__dirname}/../views/partials/navbar.ejs`, {req, res, themeConfig, config: dbdConfig, now: 'leaderboard'})}
              <!-- End Navbar -->
              <%
              const images = ["curved-1", "curved-2", "curved-3", "curved-4", "curved-5", "curved-6", "curved-7", "curved-8", "curved-9", "curved-10", "curved-11", "curved-12", "curved-13", "curved-14", "curved-15", "curved-16", "curved-17", "curved-18"];
    
              const image = images[Math.floor(Math.random() * images.length)];
              %>
              <div class="container-fluid">
                  <div class="page-header min-height-300 border-radius-xl mt-4"
                       style="background-image: url('/img/curved-images/<%- image %>.webp'); background-position-y: 50%;">
                      <span class="mask bg-gradient-primary opacity-6"></span>
                  </div>
                  <div class="card card-body blur shadow-blur mx-4 mt-n6 overflow-hidden">
                      <div class="row gx-4">
                          <div class="col-auto">
                              <div class="avatar avatar-xl position-relative">
                                  <img id="img" src="<%= guildIcon %>" alt="profile_image"
                                       class="w-100 border-radius-lg shadow-sm">
                              </div>
                          </div>
                          <div class="col-auto my-auto">
                              <div class="h-100">
                                  <h5 id="title" class="mb-1">
                                      <%= guildName %>'s Leaderboard
                                  </h5>
                                  <p id="desc" class="mb-0 font-weight-bold text-sm">
                                      <b>Server ID: </b><%= guildID  %>
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="container-fluid py-4">
              <div class="row">
                <div class="col-md-12 mt-4">
                  <div class="card">
                    <div class="card-body pt-4 p-4">
                      <ul class="list-group">
                        <% data.forEach(item=> {
                          let colour = "";
                          let highlighted = false;

                          if (req.session?.user?.id === item.userID) highlighted = true;

                          if (item.position === 1) colour = "one";
                          else if (item.position === 2) colour = "two";
                          else if (item.position === 3) colour = "three";
                          else colour = "bg-gradient-light";
                          %>
                          <li
                            class="list-group-item border-0 d-flex p-3 mb-2 bg-gray-100 border-radius-lg <% if (highlighted){ %>bg-gradient-dark<% } %>">
                            <div class="name-content d-flex">
                              <div class="d-flex placement-div <%= colour%>">
                                <%= item.position%>
                              </div>
                              <h6 class="mb-3 text-sm"
                                style="margin-bottom: 0 !important; align-self: center; margin-left: 1rem; ">
                                <%= item.username%>
                              </h6>
                            </div>
                            <div class="ms-auto text-end end-col">
                              <% if (config.ownerIDs.includes(req.session?.user?.id) &&
                                themeConfig.leaderboard.resetUser) { %>
                                <button type="button" class="btn btn-danger"
                                  style="align-self: center; margin: 0; padding: 5px;"
                                  onclick="resetUser('<%=item.userID %>', '<%= guildID %>')">reset user</button>
                                <% } %>
                                  <% if (item.messages) { %>
                                    <div class="d-flex" style="flex-direction: column; text-align: center;">
                                      <p class="mb-0 font-weight-bold text-sm">Messages</p>
                                      <a style="font-size: smaller;">
                                        <%= item.messages%>
                                      </a>
                                    </div>
                                    <% } %>
                                      <div class="d-flex" style="flex-direction: column; text-align: center;">
                                        <p class="mb-0 font-weight-bold text-sm">Experience</p>
                                        <a style="font-size: smaller;">
                                          <%= item.xp%>
                                        </a>
                                      </div>
                                      <div role="progressbars" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"
                                        style="--value:<%= item.perc%>; --level: <%= item.level%>"></div>
                            </div>
                          </li>
                          <% }) %>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                ${await ejs.renderFile(`${__dirname}/../views/partials/footer.ejs`, {req, res, themeConfig, config: dbdConfig, now: 'leaderboard'})}
              </div>
          </div>
            ${await ejs.renderFile(`${__dirname}/../views/partials/scripts.ejs`, {req, res, themeConfig, config: dbdConfig, now: 'leaderboard'})}
            
          <script>
            function resetUser(user, guild) {
              $.ajax({
                url: '/leaderboard/reset/',
                type: "POST",
                data: {
                  userId: user,
                  guildId: guild
                },
                success: function (data) {
                  location.reload();
                },
                error: function (data) {
                  console.log(data);
                }
              });
            }
          </script>
          </body>
          </html>`;

          const { guildId } = req.params;
          const client = dbdConfig.bot;

          let lb = await themeConfig.leaderboard.fetch({ guildId })
  
          lb.sort((a, b) => a.rank - b.rank)
  
          lb.map((x, i) => (x.position = i + 1))

          let guildIcon;
          const guild = client.guilds.cache.get(guildId);
          if (!guild?.iconURL()) guildIcon = themeConfig.icons.noGuildIcon;
          else guildIcon = guild.iconURL();

          let html = ejs.render(template, {
            req: req,
            config: dbdConfig,
            themeConfig,
            guildIcon,
            guildName: guild?.name,
            guildID: guildId,
            data: lb
          });

          res.setHeader("Content-Type", "text/html");
          res.send(html);
        });
        console.log("{{ADDON_SUCCESS}}");
      } else console.log("{{ADDON_ERROR}}");
    } else console.log("{{ADDON_ERROR}}");
    // } else console.log("{{ADDON_ERROR}}")
  },
};
