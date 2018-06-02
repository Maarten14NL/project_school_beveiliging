<?php
include 'include/database.php';
include 'include/functions.php';
include 'include/login.php';
include 'include/session.php';
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <script src="dest/js/jquery.min.js"></script>
    <script src="dest/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="dest/css/bootstrap.min.css">
    <link rel="stylesheet" href="dest/css/app.css">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Navbar</a>
    <div class="login-status-container">
      <div class="login-status">U bent nog niet ingelogd</div>
      <button type="button" class="btn btn-primary logout hidden">uitloggen</button>
    </div>
  </nav>
    <!-- <button class="btn">hallo test</button> -->
    <div class="row">
        <div class="col-6 container-left">
            <div class="menu">
                <div class="menu-item floor_0">Begane Grond</div>
                <div class="menu-item floor_1">Verdieping 1</div>
                <div class="menu-item floor_2">Verdieping 2</div>
                <div class="menu-item floor_3">Verdieping 3</div>
            </div>
            <div class="verdieping verdieping__0">
                <div class="fill1 filler"></div>
                <div class="fill2 filler"></div>
                <div class="ingang lokaal">Ingang</div>
                <div class="L020 lokaal">0.20</div>
                <div class="L018 lokaal">0.18</div>
                <div class="L016 lokaal">0.16</div>
                <div class="L014 lokaal">0.14</div>
                <div class="L012 lokaal">0.12</div>
                <div class="L010 lokaal">0.10</div>
                <div class="L008 lokaal">0.08</div>
                <div class="L007 lokaal">0.07</div>
                <div class="L006 lokaal">0.06</div>
                <div class="L005B lokaal">0.05B</div>
                <div class="L005A lokaal">0.05A</div>
                <div class="L004 lokaal">0.04</div>
                <div class="L003 lokaal">0.03</div>
                <div class="L002D lokaal">0.02D</div>
                <div class="L002C lokaal">0.02C</div>
                <div class="L002B lokaal">0.02B</div>
                <div class="L002A lokaal">0.02A</div>
                <div class="L001E lokaal">0.01E</div>
                <div class="L001D lokaal">0.01D</div>
                <div class="L001B lokaal">0.01B</div>
                <div class="L001A lokaal">0.01A</div>
                <div class="L0E1 lokaal">--</div>
            </div>
            <div class="verdieping verdieping__1 hidden">
                <div class="L118 lokaal">1.18</div>
                <div class="L116 lokaal">1.16</div>
                <div class="L114 lokaal">1.14</div>
                <div class="v1-empty-1 lokaal">--</div>
                <div class="L112 lokaal">1.12</div>
                <div class="L108 lokaal">1.08</div>
                <div class="L106 lokaal">1.06</div>
                <div class="L104 lokaal">1.04</div>
                <div class="L102 lokaal">1.02</div>
                <div class="v1-empty-2 lokaal">--</div>
                <div class="L101a lokaal">1.01a</div>
                <div class="L101 lokaal">1.01</div>
                <div class="L103 lokaal">1.03</div>
                <div class="L105 lokaal">1.05</div>
                <div class="L105a lokaal">1.05a</div>
                <div class="L107 lokaal">1.07</div>
                <div class="L109 lokaal">1.09</div>
                <div class="L111 lokaal">1.11</div>
                <div class="L113 lokaal">1.13</div>
                <div class="v1-filler-1 filler"></div>
            </div>
            <div class="verdieping verdieping__2">
                <div class="L216 lokaal">2.16</div>
                <div class="L214 lokaal">2.14</div>
                <div class="L212 lokaal">2.12</div>
                <div class="L210 lokaal">2.10</div>
                <div class="L208 lokaal">2.08</div>
                <div class="L206 lokaal">2.06</div>
                <div class="L204 lokaal">2.04</div>
                <div class="L202a lokaal">2.02a</div>
                <div class="L202b lokaal">2.02b</div>
                <div class="L202 lokaal">2.02</div>
                <div class="v2-empty-1 lokaal">--</div>
                <div class="L201a lokaal">2.01a</div>
                <div class="L201 lokaal">2.01</div>
                <div class="L203 lokaal">2.03</div>
                <div class="L205 lokaal">2.05</div>
                <div class="L207 lokaal">2.07</div>
                <div class="L209 lokaal">2.09</div>
                <div class="L211 lokaal">2.11</div>
                <div class="v2-empty-2 lokaal">2.--</div>
                <div class="L213 lokaal">2.13</div>
                <div class="L215 lokaal">2.15</div>
                <div class="L217 lokaal">2.17</div>
                <div class="L217a lokaal">2.17a</div>
                <div class="L224 lokaal">2.24</div>
                <div class="L222 lokaal">2.22</div>
                <div class="L220 lokaal">2.20</div>
                <div class="L218a lokaal">2.18a</div>
                <div class="L218b lokaal">2.18b</div>
            </div>
            <div class="verdieping verdieping__3 hidden">
                <div class="fill3 filler"></div>
                <div class="L316 lokaal">3.16</div>
                <div class="L315 lokaal">3.15</div>
                <div class="L314 lokaal">3.14</div>
                <div class="L313 lokaal">3.13</div>
                <div class="L312 lokaal">3.12</div>
                <div class="L311 lokaal">3.11</div>
                <div class="L310 lokaal">3.10</div>
                <div class="L309 lokaal">3.09</div>
                <div class="L308 lokaal">3.08</div>
                <div class="L307 lokaal">3.07</div>
                <div class="L306 lokaal">3.06</div>
                <div class="L305 lokaal">3.05</div>
                <div class="L304 lokaal">3.04</div>
                <div class="L303 lokaal">3.03</div>
                <div class="L302 lokaal">3.02</div>
                <div class="L301 lokaal">3.01</div>
                <div class="L3E1 lokaal">--</div>
                <div class="L3E2 lokaal"></div>
                <div class="L3E3 lokaal"></div>
            </div>
        </div>
        <div class="col">
          <div class="login-container">
            <input class="form-control form-control-lg username" type="text" placeholder="Gebruikersnaam">
            <input class="form-control form-control-lg password" type="password" placeholder="Wachtwoord">
            <button type="button" class="btn btn-lg btn-primary login">inloggen</button>
          </div>

          <div class="user-level user-level_1 hidden">
            <div class="user-navigation">
              <div class="options level_1 option_1">Gebruiker Toevoegen</div>
              <div class="options level_1 option_2">Gebruiker Verwijderen</div>
              <div class="options level_1 option_3">Account Instellingen</div>
            </div>
            <div class="user-body">
              <div class="view view_1-1">
                <input class="form-control" type="text" placeholder="Gebruikersnaam">
                <input class="form-control" type="text" placeholder="Wachtwoord">
                <select class="form-control" placeholder="Gebruikerslevel">
                  <option>Student</option>
                  <option>Docent</option>
                </select>
                <div class="btn btn-secondary btn-block">Gebruiker Toevoegen</div>
              </div>
              <div class="view view_1-2 hidden">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">GebruikersNaam</th>
                      <th scope="col">GebruikersLevel</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>1</th>
                      <td>Docent</td>
                      <td>Docent</td>
                      <td><button type="button" class="btn btn-primary">Verwijderen</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="view view_1-3 hidden">
              </div>
            </div>
          </div>
          <div class="user-level user-level_2 hidden">
            <div class="user-navigation">
              <div class="options level_2 option_1">Scenario's kiezen</div>
              <div class="options level_2 option_2">Scenario's maken</div>
              <div class="options level_2 option_3">Scenario's aanpassen</div>
              <div class="options level_2 option_4">Scenario's verwijderen</div>
            </div>
            <div class="user-body">
              <div class="view view_2-1">
                <select class="form-control" placeholder="Gebruikerslevel">
                  <option>Brand</option>
                  <option>Gaslek</option>
                </select>
                <button type="button" class="btn btn-primary">scenario maken</button>
              </div>
              <div class="view view_2-2 hidden">
                <input class="form-control" type="text">
                <input class="form-control" type="text">
                <input class="form-control" type="text">
                <input class="form-control" type="text">
                <input class="form-control" type="text">
                <input class="form-control" type="text">
                <input class="form-control" type="text">
                <input class="form-control" type="text">
                <input class="form-control" type="text">
              </div>
              <div class="view view_2-3 hidden">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Naam van scenario</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>1</th>
                      <td>Docent</td>
                      <td><button type="button" class="btn btn-primary">aanpassen</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="view view_2-4 hidden">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Naam van scenario</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>1</th>
                      <td>Docent</td>
                      <td><button type="button" class="btn btn-primary">verwijderen</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="user-level user-level_3 hidden">

          </div>
        </div>
    </div>

    <script src="dest/js/main.js" charset="utf-8"></script>
</body>
</html>
