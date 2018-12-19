<?php
include 'include/database.php';
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
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <div class="js-fl-cont flash-message-container"></div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <img src="img/RocTeraa-Logo.png" class="teraaloga">
        <div class="login-status-container">
            <div class="login-status">U bent nog niet ingelogd</div>
            <button type="button" class="btn btn-secondary logout hidden">
                Uitloggen
                <i class="fas fa-sign-out-alt"></i>
            </button>
            <i class="fas fa-cog settings hidden"></i>
        </div>
    </nav>
    <div class="row">
        <div class="col-sm-6">
            <ul class="nav nav-tabs extra-border">
                <li class="nav-item">
                    <a data-floor="0" class="nav-link active menu-item floor_0" href="#">Begane Grond</a>
                </li>
                <li class="nav-item">
                    <a data-floor="1" class="nav-link menu-item floor_1" href="#">Verdieping 1</a>
                </li>
                <li class="nav-item">
                    <a data-floor="2" class="nav-link menu-item floor_2" href="#">Verdieping 2</a>
                </li>
                <li class="nav-item">
                    <a data-floor="3" class="nav-link menu-item floor_3" href="#">Verdieping 3</a>
                </li>
            </ul>
            <?php include 'partials/floor_plans.html'; ?>
        </div>
        <div class="col-sm-6">
            <div class="login-container card m-4 p-4">
                <h5 class="card-title">Login</h5>
                <div class="form-group">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-primary text-white" id="loggin-addon1"><i class="fas fa-user"></i></span>
                        </div>
                        <input class="form-control form-control-lg username" type="text" placeholder="Gebruikersnaam" aria-describedby="loggin-addon1">
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-primary text-white" id="password-addon1"><i class="fas fa-unlock"></i></span>
                        </div>
                        <input class="form-control form-control-lg password" type="password" placeholder="Wachtwoord" aria-describedby="password-addon1">
                    </div>
                    <button type="button" class="btn btn-block btn-secondary login">
                        Inloggen
                        <i class="fas fa-sign-in-alt"></i>
                    </button>
                </div>
            </div>
            <?php include 'partials/user_level1.html'; ?>
            <?php include 'partials/user_level2.html'; ?>
            <div class="user-level user-level_3 hidden">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title js-alert-title">Meldingen</h5>
                        </div>
                        <div class="modal-body js-alert-body">
                            Er zijn geen meldingen op dit moment
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="close js-close-scenario-modal" data-dismiss="modal" data-activeId="0" aria-label="Close">
                                <span aria-hidden="true"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
    <?php include 'partials/templates.html'; ?>
    <?php include 'partials/modals.html'; ?>

    <script src="dest/js/main.js" charset="utf-8"></script>
</body>
</html>
