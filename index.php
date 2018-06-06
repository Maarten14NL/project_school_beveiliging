<?php
include 'include/database.php';
include 'include/functions.php';
include 'include/session.php';
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <script src="dest/js/jquery.min.js"></script>
    <script src="dest/js/bootstrap.min.js"></script>
    <script src="dest/js/mustache.js"></script>
    <link rel="stylesheet" href="dest/css/bootstrap.min.css">
    <link rel="stylesheet" href="dest/css/fontawesome-all.css">
    <link rel="stylesheet" href="dest/css/app.css">
    <!-- <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.10/css/all.css" integrity="sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg" crossorigin="anonymous"> -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <!-- <div class="js-flash flash-message">
        hallo
    </div> -->
    <div class="js-fl-cont flash-message-container">

    </div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Navbar</a>
        <div class="login-status-container">
            <div class="login-status">U bent nog niet ingelogd</div>
            <button type="button" class="btn btn-secondary logout hidden">uitloggen</button>
            <i class="fas fa-cog settings hidden"></i>
        </div>
    </nav>

    <!-- <button class="btn">hallo test</button> -->
    <div class="row">
        <div class="col-6-sm container-left m-4 p-4">
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <a class="nav-link active menu-item floor_0" href="#">Begane Grond</a>
              </li>
              <li class="nav-item">
                <a class="nav-link menu-item floor_1" href="#">Verdieping 1</a>
              </li>
              <li class="nav-item">
                <a class="nav-link menu-item floor_2" href="#">Verdieping 2</a>
              </li>
              <li class="nav-item">
                <a class="nav-link menu-item floor_3" href="#">Verdieping 3</a>
              </li>
            </ul>
<!--             <div class="menu">
                <div class="menu-item floor_0">Begane Grond</div>
                <div class="menu-item floor_1">Verdieping 1</div>
                <div class="menu-item floor_2">Verdieping 2</div>
                <div class="menu-item floor_3">Verdieping 3</div>
            </div> -->

            <div class="verdieping verdieping__0 hidden m-4">
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
            <div class="verdieping verdieping__1 hidden m-4">
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
            <div class="verdieping verdieping__2 hidden m-4">
                <div class="v2-filler-1 filler"></div>
                <div class="v2-filler-2 filler filler--white"></div>
                <div class="v2-filler-3 filler"></div>
                <div class="v2-filler-4 filler"></div>
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
                <div class="v2-empty-2 lokaal">--</div>
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
            <div class="verdieping verdieping__3 m-4 ">
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
        <div class="col m-4 p-4">
            <div class="login-container card m-4 p-4">
                <h5 class="card-title">Login</h5>
                <div class="form-group">

                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="loggin-addon1"><i class="fas fa-user"></i></span>
                        </div>
                        <input class="form-control form-control-lg username" type="text" placeholder="Gebruikersnaam" aria-describedby="loggin-addon1">
                    </div>

                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="password-addon1"><i class="fas fa-unlock"></i></span>
                        </div>
                    <input class="form-control form-control-lg password" type="password" placeholder="Wachtwoord" aria-describedby="password-addon1">
                    </div>

                    <button type="button" class="btn btn-block btn-secondary login"><I></I>nloggen</button>
                </div>
            </div>
            <div class="user-level user-level_1 hidden">
                <div class="user-navigation">
                    <div class="options level_1 option_1">Gebruiker Toevoegen</div>
                    <div class="options level_1 option_2">Gebruiker Instellingen</div>
                </div>
                <div class="user-body">
                    <div class="view view_1-1">
                        <input class="form-control new-user-name" type="text" placeholder="Gebruikersnaam">
                        <input class="form-control new-user-password" type="text" placeholder="Wachtwoord">
                        <select class="form-control new-user-level" placeholder="Gebruikerslevel">
                            <option class="new-user-options new-user-option1" value="" disabled selected>Select your option</option>
                            <option class="new-user-options" value="3">Student</option>
                            <option class="new-user-options" value="2">Docent</option>
                        </select>
                        <div class="btn btn-secondary btn-block new-user">Gebruiker Toevoegen</div>
                    </div>
                    <div class="view view_1-2 hidden">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">GebruikersNaam</th>
                                    <th scope="col">level</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody class="user-level1-edit">
                                <tr>
                                    <th>1</th>
                                    <td>Docent</td>
                                    <td>Docent</td>
                                    <td><button type="button" class="btn btn-primary">Verwijderen</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="user-level user-level_2 hidden">
                <div class="user-navigation">
                    <div class="options level_2 option_1">Scenario's kiezen</div>
                    <div class="options level_2 option_2">Scenario's maken</div>
                    <div class="options level_2 option_3">Scenario instellingen</div>
                    <!-- <div class="options level_2 option_4">Scenario's verwijderen</div> -->
                </div>
                <div class="user-body">
                    <div class="view view_2-1 hidden">
                        <div class="row">
                            <select class="form-control scenario-selector js-scenarioselect">
                            </select>
                        </div>
                        <div class="row row--disfl">
                            <label class="switch">
                                <input class="switch__input js-switch" type="checkbox">
                                <span class="switch__span switch__span--round"></span>
                            </label>
                            <p>Laat de student de hulpmiddelen zien</p>
                        </div>
                        <div class="row row--disfl">
                            <button type="button" class="js-start-scenario btn btn-secondary">scenario maken</button>
                            <h4 class="js-lokaal"></h4>
                        </div>
                    </div>
                    <div class="view view_2-2">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Naam:</th>
                                    <th> <input type="text" class="js-new-scenario-name" name="scenario-name" value=""> </th>
                                </tr>
                            </thead>
                        </table>
                        <div class="buttons-container">
                            <button class="btn btn-success js-save-new-scenario">Opslaan</button>
                            <button class="btn btn-success js-addstep">Extra stap</button>
                        </div>
                        <h3>Voeg stappen toe</h3>
                        <div class="js-steps-container steps">
                            <div class="js-step steps__step">
                                <h4>Stap <span class="js-stepnr js-lastnr">1</span></h4>
                                <input class="js-newstep" type="text" name="" value="">
                                <i style="color: red;" class="far fa-times-circle js-delete-step"></i>
                            </div>
                        </div>
                        <div class="js-copystep hidden steps__step">
                            <h4>Stap <span class="js-stepnr js-newnr">1</span></h4>
                            <input class="js-newstep" type="text" name="" value="">
                            <i style="color: red;" class="far fa-times-circle js-delete-step"></i>
                        </div>
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
                            <tbody class="js-scenario-container">
                                <tr>
                                    <th>1</th>
                                    <td>Docent</td>
                                    <td><button type="button" class="btn btn-primary">aanpassen</button></td>
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

    <div class="templateContainer">
        <template class="level1-user-template">
            {{#.}}
            <tr class="level1-index{{index}}">
                <td>{{id}}</td>
                <td>{{username}}</td>
                <td>{{level}}</td>
                <td><button type="button" class="btn btn-primary level1-btn-edit">aanpassen</button></td>
                <td><button type="button" class="btn btn-danger level1-btn-delete">verwijderen</button></td>
            </tr>
            {{/.}}
        </template>

        <template class="level2-scenario-template">
            {{#.}}
            <tr class="level2-index{{id}}">
                <td>{{id}}</td>
                <td class="username">{{name}}</td>
                <td>
                    <button type="button" class="btn btn-primary level2-btn-edit">Aanpassen</button>
                    <button type="button" class="btn btn-danger level2-btn-delete">Verwijderen</button>
                </td>
            </tr>
            {{/.}}
        </template>

      <template class="level2-scenario-edit-template">
        {{#.}}
        <div class="js-scenario-edit-step scenario-edit-container">
          <h4>Stap <span class="">{{index}}</span></h4>
          <input class="js-scenario-edit-edit js-scenario-edit-{{index}}" type="text" name="" value="{{description}}">
          <!-- <i style="color: red;" class="far fa-times-circle js-scenario-edit-delete"></i> -->
        </div>
        {{/.}}
      </template>
    </div>

    <div class="modal user-settings" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Settings</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>gebruikersnaam</label>
                        <input type="text" class="form-control settings-inputs settings-username" >
                    </div>
                    <div class="form-group">
                        <label>wachtwoord</label>
                        <input type="password" class="form-control settings-inputs settings-password" >
                    </div>
                    <div class="form-group">
                        <label>herhaling wachtwoord</label>
                        <input type="password" class="form-control settings-inputs settings-repeat-password" >
                    </div>
                    <button type="submit" class="btn btn-success settings-update">bijwerken</button>
                    <button type="submit" class="btn btn-danger settings-cancel">cancel</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal update-users" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Settings</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>gebruikersnaam</label>
                        <input type="text" class="form-control update-users-inputs update-users-username" >
                    </div>
                    <div class="form-group">
                        <label>wachtwoord</label>
                        <input type="password" class="form-control update-users-inputs update-users-password" >
                    </div>
                    <div class="form-group">
                        <label>herhaling wachtwoord</label>
                        <input type="password" class="form-control update-users-inputs update-users-repeat-password" >
                    </div>
                    <select class="form-control update-user-level">
                        <option class="update-user-options update-user-option1" value="3">Student</option>
                        <option class="update-user-options update-user-option2" value="2">Docent</option>
                    </select>
                    <button type="submit" class="btn btn-success update-users-update">bijwerken</button>
                    <button type="submit" class="btn btn-danger update-users-cancel">cancel</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal scenario" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Settings</h5>
                </div>
                <div class="modal-body">

                </div>
                <div class="modal-footer">
                    <button type="button" class="close js-close-scenario-modal" data-dismiss="modal" data-activeId="0" aria-label="Close">
                        <span aria-hidden="true">Afronden</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal scenario-edit" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Settings</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>name</label>
                        <input type="text" class="form-control update-scenarios-name" >
                    </div>
                    <div class="scenario-edit-options-container">
                    </div>
                    <button type="submit" class="btn btn-primary update-scenarios-update">bijwerken</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal js-confirm" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title confirm-title">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p class="confirm-text">Modal body text goes here.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success confirm-save-change">Accepteren</button>
            <button type="button" class="btn btn-danger confirm-delete-change" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <script src="dest/js/main.js" charset="utf-8"></script>
</body>
</html>
