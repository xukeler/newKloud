<template>
  <div id="school-preview">
    <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">

    <header class="pt-header pt-header-school">
      <div class="container">
        <a href="#" class="icon icon-menu pull-left"></a>
        <a href="/" class="pull-left pt-logo">PeerTime</a>
        <nav class="pt-nav pull-left">
          <ul>
            <li><a href="#">Categories</a></li>
            <li><a href="#">My Klassroom</a></li>
            <li><a href="#">Specialty Tutoring</a></li>
            <li><a href="#">Demos</a></li>
            <li><a href="#">Become a Tutor</a></li>
          </ul>
        </nav>
        <div class="pull-right pt-header-links">
          <a class="" href="#" role="button">Login</a>
          <a class="" href="#" role="button">Sign Up</a>
          <div class="pt-header-cart">
            <span class="icon icon-cart"></span>
            <span class="badge">4</span>
          </div>
        </div>

      </div>
    </header>

    <section class="pt-school-nav">
      <div class="container">
        <span class="pull-left pt-school-logo text-22">{{schoolInfo.SchoolName}}</span>
        <ul class="pt-ul hidden-xs pull-left">
          <li><a href="#" class="on">Home</a></li>
          <li><a href="#">Tutors</a></li>
          <li><a href="#">Courses</a></li>
          <li><a href="#">page1</a></li>
          <li><a href="#">page2</a></li>
        </ul>
        <div class="pt-school-search hidden-xs">
          <div class="input-group">
            <div class="input-group-btn">
              <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">School <span class="caret"></span></button>
              <ul class="dropdown-menu">
                <li><a href="#">School</a></li>
                <li><a href="#">PeerTime</a></li>
              </ul>
            </div><!-- /btn-group -->
            <input type="text" class="form-control" aria-label="...">
          </div>
          <a href="#" class="icon icon-search"></a>
        </div>
        <a href="#" class="icon icon-menu visible-xs-inline-block"></a>

      </div>
    </section>
    <section class="pt-school-banner" :style="{ 'background': 'url(' + schoolInfo.MainPictureUrl + ') no-repeat' }">
      <div class="container text-center">
        <p><img src="/static/preview/images/temp/sample-school-1.svg" alt=""></p>
        <h2 class="text-36" v-html="schoolInfo.Slogan"></h2>
        <p class="text-16"></p>
        <a href="#" class="btn btn-success btn-lg">Enroll Now</a>
      </div>
    </section>
    <section class="pt-school-about">
      <div class="container">
        <p class="text-16 text-gray">ABOUT US</p>
        <div v-html="schoolInfo.Introduction">

        </div>
      </div>
    </section>
    <section class="pt-school-courses">
      <div class="container">
        <h2 class="text-36 text-dark">Popular Courses</h2>
        <p class="text-16 text-gray">Compatible Inkjet Cartridge Which One Will You Choose</p>
        <div class="pt-school-courses-cat row">
          <div class="col-lg-2 col-md-3 col-sm-4" v-for="item in interests">
            <a href="#">
              <img src="/static/preview/images/temp/06.svg" alt="">
              <p class="text-16">{{item.title}}</p>
            </a>
          </div>
          <!--<div class="col-lg-2 col-md-3 col-sm-4 ">
            <a href="#">
              <img src="/static/preview/images/temp/01.svg" alt="">
              <p class="text-16">High School Subjects</p>
            </a>
          </div>
          <div class="col-lg-2 col-md-3 col-sm-4">
            <a href="#">
              <img src="/static/preview/images/temp/02.svg" alt="">
              <p class="text-16">Test Prep</p>
            </a>
          </div>
          <div class="col-lg-2 col-md-3 col-sm-4">
            <a href="#">
              <img src="/static/preview/images/temp/03.svg" alt="">
              <p class="text-16">Language Learning</p>
            </a>
          </div>
          <div class="col-lg-2 col-md-3 col-sm-4">
            <a href="#">
              <img src="/static/preview/images/temp/04.svg" alt="">
              <p class="text-16">Computer Science</p>
            </a>
          </div>
          <div class="col-lg-2 col-md-3 col-sm-4">
            <a href="#">
              <img src="/static/preview/images/temp/05.svg" alt="">
              <p class="text-16">Art</p>
            </a>
          </div>
          <div class="col-lg-2 col-md-3 col-sm-4">
            <a href="#">
              <img src="/static/preview/images/temp/06.svg" alt="">
              <p class="text-16">Others</p>
            </a>
          </div>-->
        </div>
        <div class="pt-school-courses-list text-left">
          <h3 class="text-18 text-dark pad-lr-8">Development</h3>
          <div class="pt-school-courses-list-wrap">
            <a href="#" class="icon icon-left hidden text-dark"></a>
            <div class="row">
              <div v-for="(course, $index) in courseList" v-if="$index < 4" class="col-sm-6 col-md-4 col-lg-3">
                <div class="pt-course-related-item">
                  <h3 class="text-dark">{{course.Title}}</h3>
                  <div class="pad-lr-16">
                    <p class="clearfix text-12 text-gray">
                      <span class="pull-left">
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i> 4.8(112)
                      </span>
                      <span class="pull-right">{{course.LessonCost}} Lesson</span>
                    </p>
                    <p class="clearfix text-12 ">
                      <span class="text-blue pull-left">High school level</span>
                      <span class="text-gray pull-right">221 Enrolled</span>
                    </p>
                    <p class="pt-avatar-list pad-tb-16">
                      <span class="pt-avatar"><img src="/static/preview/images/temp/instructor-img1.png" alt=""></span>
                      <span class="pt-avatar"><img src="/static/preview/images/temp/instructor-img.png" alt=""></span>
                    </p>
                  </div>
                  <div class="pt-course-related-footer clearfix">
                    <a href="#" class="icon icon-fav pull-left text-gray"></a>
                    <span class="pull-right"><img src="/static/preview/images/live.svg" alt=""> <img src="/static/preview/images/livetime.svg" alt=""></span>
                  </div>
                </div>
              </div>
            </div>
            <a href="#" class="icon icon-right text-dark"></a>
            <a href="#" class="btn btn-primary btn-block mar-t-16 visible-xs">Load More...</a>
          </div>
        </div>
      </div>
    </section>
    <section class="pt-school-ad">
      <div class="pt-img-auto"><img src="/static/preview/images/temp/ad.png" alt=""></div>
    </section>
    <section class="pt-school-tutors">
      <div class="container">
        <h2 class="text-36 text-dark">Our Tutors</h2>
        <p class="text-16 text-gray">Compatible Inkjet Cartridge Which One Will You Choose</p>
        <div class="pt-school-tutors-wrap">
          <div class="row">
            <div v-for="(teacher, $index) in teacherList" v-if="$index < 5" class="col-lg-2-4 col-md-3 col-sm-6">
              <div class="pt-school-tutor-item">
                <p class="pt-avatar-wrap"><span class="pt-avatar"><img :src="teacher.AvatarUrl" alt=""></span></p>
                <div class="pad-lr-16">
                  <h3 class="text-14 text-dark">{{teacher.UserName}}</h3>
                  <span class="pt-inline-block mar-b-16">
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i> 4.8(112)
                  </span>
                  <p class="text-gray text-12">Good at English, Italian and Other Languages</p>
                </div>

                <p class="pt-school-tutor-footer row">
                  <span class="col-md-6">
                    <span class="pt-block">120</span>
                    <span class="text-12 text-gray">Courses</span>
                  </span>

                  <span class="col-md-6">
                    <span class="pt-block">3,600</span>
                    <span class="text-12 text-gray">Students</span>
                  </span>
                </p>

              </div>
            </div>
          </div>
        </div>
        <a href="#" class="btn btn-default">Explore All</a>
      </div>
    </section>
    <section class="pt-school-map">
      <div class="pt-img-auto"><img src="/static/preview/images/temp/sample-map.png" alt=""></div>
    </section>

    <footer class="pt-footer">
      <div class="pt-footer-link">
        <div class="container">
          <div class="row">
            <div class="col-md-2 col-sm-4">
              <p><a href="#">Student Sign up</a></p>
              <p><a href="#">Parent sign up</a></p>
              <p><a href="#"><b>Become a Tutor</b></a></p>
              <p><a href="#"><b>Build online school</b></a></p>
            </div>
            <div class="col-md-7 col-sm-8">
              <div class="row">
                <div class="col-sm-4 col-md-4">
                  <h3 class="text-14">Tutors</h3>
                  <ul>
                    <li><a href="#">Math</a></li>
                    <li><a href="#">English</a></li>
                    <li><a href="#">Science</a></li>
                    <li><a href="#">Test Prep</a></li>
                    <li><a href="#">Admissions Help</a></li>
                  </ul>
                </div>
                <div class="col-sm-4 col-md-4">
                  <h3 class="text-14">About PeerTime</h3>
                  <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Press</a></li>
                    <li><a href="#">Advisors</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Affiliate Program</a></li>
                  </ul>
                </div>
                <div class="col-sm-4 col-md-4">
                  <h3 class="text-14">Support</h3>
                  <ul>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Watch Demos</a></li>
                    <li><a href="#">Help Center</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-md-3 pt-app-download">
              <h3 class="text-16">Download the mobile app</h3>
              <p class="">
                <a href="#"><img src="/static/preview/images/app-store.png" width="114" alt=""></a>
                <a href="#"><img src="/static/preview/images/google-play.png" width="128" alt=""></a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="pt-footer-copyright">
        <div class="container">
          <div class="row text-12">
            <div class="col-md-8">
              <a href="#" class="pt-footer-logo"><img src="/static/preview/images/Logo.svg" width="100" alt=""></a>
              <span>© Peertime copyright 2018</span>
              <a href="#" class="text-green">For Business</a>  <span> | </span>    <a href="#">Privacy Policy</a>    <a href="#">Terms of Use</a>
            </div>
            <div class="col-md-4">
              <a href="#"><img src="/static/preview/images/Facebook.svg" alt=""></a>
              <a href="#"><img src="/static/preview/images/Google.svg" alt=""></a>
              <a href="#"><img src="/static/preview/images/twitter.svg" alt=""></a>
              <a href="#"><img src="/static/preview/images/Instagram.svg" alt=""></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
  $IMAGES-ROOT: "../../../static/preview/images/";

  $BASEFONTCOLOR: #627890;
  $TITLEFONTCOLOR: #1F345D;
  $LINKFONTCOLOR: #5E8DD4;
  $HIGHLIGHTCOLOR: #64C092;
  $DARKCOLOR: #1A284D;
  $BORDERCOLOR: #D9D9D9;

  $BGLIGHTCOLOR: #F1F6FD;
  $BGGRAYCOLOR: #F8F8F8;

  $GRAYCOLOR: #F8F8F8;
  $REDCOLOR: #D0021B;
  $WHITEFONTCOLOR:#D2D6DE;

  $DEFAULTGUTTER: 8px;

  #school-preview {
    text-align: left;
    overflow: auto;
    font-family: 'PingFang SC',Arial,Tahoma,Helvetica,'Microsoft Yahei',sans-serif;
    color: $BASEFONTCOLOR;

    .container{ padding-left: $DEFAULTGUTTER; padding-right: $DEFAULTGUTTER;}
    .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-xs-1, .col-xs-10, .col-xs-11, .col-xs-12, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9 {
      padding-left: $DEFAULTGUTTER; padding-right: $DEFAULTGUTTER;
    }
    .row {
      margin-right: -$DEFAULTGUTTER;
      margin-left: -$DEFAULTGUTTER;
    }

    .text-12{ font-size: 12px;}
    .text-14{ font-size: 14px;}
    .text-16{ font-size: 16px;}
    .text-18{ font-size: 18px !important;}
    .text-20{ font-size: 20px !important;}
    .text-22{ font-size: 22px;}
    .text-28{ font-size: 28px;}
    .text-36{ font-size: 36px;}

    .text-white{ color: #fff;}
    .text-gray{ color: #999;}
    .text-dark{ color: $TITLEFONTCOLOR;}
    .text-blue{ color: $LINKFONTCOLOR;}
    .text-green{ color: $HIGHLIGHTCOLOR;}

    .pt-block{ display: block;}

    .pad-r-30{ padding-right: 30px;}
    .pad-lr-8{ padding: 0 8px;}
    .pad-lr-16{ padding: 0 16px;}
    .pad-tb-16{ padding: 16px 0;}
    .pad-t-30{ padding-top: 30px;}

    .mar-0{ margin: 0 !important;}
    .mar-b-16{ margin-bottom: 16px !important;}
    .mar-t-16{ margin-top: 16px !important;}

    .pt-ul{ list-style: none; margin: 0; padding: 0;}
    .pt-img-auto img{ width: 100%;}

    //a{ color: $LINKFONTCOLOR;}

    .btn-default {  color: $BASEFONTCOLOR;  border-color: $BORDERCOLOR;  }
    .btn-default:hover { background: $GRAYCOLOR;  border-color: $BORDERCOLOR;  }
    .btn-primary {  background-color: $LINKFONTCOLOR;  border-color: $LINKFONTCOLOR;  }
    .btn-primary:hover {  background-color: $DARKCOLOR;  border-color: $DARKCOLOR;  }
    .btn-success{ background: $HIGHLIGHTCOLOR; border-color: $HIGHLIGHTCOLOR;}

    .pt-avatar{ border-radius:100%; overflow: hidden; display: inline-block;}
    .pt-avatar img{ width: 100%; height: 100%;}

    .pt-ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
    }

    .pt-ellipsis-2l{
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: normal;
    }

    @media (min-width: 1440px){
      .part {
        min-width: 1400px;
      }

      .container {
        width: 1400px;
      }
    }

    /*common used section style*/
    .pt-header .container{ height: 65px;}
    .pt-header .container .pt-logo{ text-indent: -9999px; background: url($IMAGES-ROOT + "logo.svg") no-repeat; background-size: 100% auto; width: 110px; height: 19px; margin: 23px 20px 0 0;}
    .pt-header .container .icon-menu{ display: none; font-size: 24px; line-height: 1; margin: 20px 20px 0 0;text-decoration: none;}
    .pt-nav >ul{list-style: none; margin: 0; padding: 0;}
    .pt-nav >ul>li{ float: left;}
    .pt-nav >ul>li>a{ color: $BASEFONTCOLOR; text-decoration: none; line-height: 65px; padding: 0 16px;}

    @media (max-width: 1024px){
      .pt-nav { display: none;}
    }

    @media (max-width: 1024px){
      .pt-header .container .icon-menu{ display: inline-block;}
    }

    @media (max-width: 1200px){
      .pt-nav >ul>li>a{ padding: 0 14px;}
    }

    .pt-nav >ul>li>a:hover{ color: $LINKFONTCOLOR;}

    .pt-header .pt-header-links{ height: 65px;}
    .pt-header .pt-header-links .pt-header-search{ display: inline-block; vertical-align: middle; margin: 18px 10px 0 0; height: 30px; border: 1px solid $BORDERCOLOR; border-radius:4px; }
    .pt-header-links .pt-header-search>input{ border: none; padding: 0 10px; line-height: 28px; background: transparent; font-size: 12px; float: left;}
    .pt-header-links .pt-header-search>input:focus{ outline: none;}
    .pt-header-links .pt-header-search>button[type=submit]{ border: none; background: transparent; float: right; margin-top: 2px;}
    .pt-header-links .btn{ margin-top: 18px; border-radius:4px; margin-right: 6px;}
    .pt-header-links .hidden-lg{border: none; background: transparent; display: inline-block; vertical-align: middle;  margin-top: 22px;}
    .pt-header-links .hidden-lg .icon{font-size: 20px; line-height: 1;}

    .pt-header-cart{ position: relative; float: right; margin-top: 20px;}
    .pt-header-cart .icon{ font-size: 24px; display: inline-block; line-height: 1;}
    .pt-header-cart .badge{ position: absolute; top: -4px;  right: -12px; background: $REDCOLOR;}

    @media (max-width: 414px){
      .pt-header-links .btn{ display: none;}
    }

    .pt-no-gutter.container,.pt-no-gutter.container .row>div{ padding: 0;}
    .pt-no-gutter.container .row{ margin: 0;}

    .pt-footer-link{ background: $GRAYCOLOR; padding: 60px 0;}
    .pt-footer-link a{ font-size: 12px;}
    .pt-footer-link .col-md-2 a{  text-transform: uppercase;}
    .pt-footer-link .col-md-2 a>b{ color: $TITLEFONTCOLOR; }
    .pt-footer-link .col-md-7{ border-left: 1px solid $BORDERCOLOR; border-right: 1px solid $BORDERCOLOR; padding-left: 60px;}
    .pt-footer-link .col-md-7 .col-md-4{ padding-left: 20px;}
    .pt-footer-link .col-md-7 h3{ margin: 0 0 10px;}
    .pt-footer-link .col-md-7 ul{ list-style: none; margin: 0; padding: 0;}
    .pt-footer-link .col-md-7 li{ padding-bottom: 6px;}
    .pt-app-download{ text-align: right;}
    .pt-app-download h3{ margin: 0 0 16px;}
    .pt-app-download p a{  display: inline-block; padding-bottom: 14px;}

    .pt-footer-copyright{ padding: 20px 0;}
    .pt-footer-copyright a,.pt-footer-copyright span{ display: inline-block; vertical-align: middle; margin-left:14px;}
    .pt-footer-copyright .col-md-4{ text-align: right;}
    .pt-footer-copyright  .pt-footer-logo{ margin-left: 0; padding-bottom: 6px;}

    @media (max-width: 992px){
      .pt-app-download{ text-align: center !important; padding-top: 30px;  display: block;  clear: both;}
      .pt-footer-copyright .col-md-4,.pt-footer-copyright .col-md-8{ text-align: center; padding-top: 10px;}
    }

    @media (max-width: 768px){
      .pt-footer-link .col-md-2,.pt-footer-link .col-md-7{ text-align: center;}
      .pt-footer-link .col-md-7{ border:none; padding: 20px 0;}
      .pt-footer-link .col-md-7>.row{ margin: 0;}
    }

    /*school page header style*/
    .pt-header-school.pt-header{ border-bottom: 1px solid $BORDERCOLOR;}
    .pt-header-school.pt-header .container{ height: 40px;}
    .pt-header-school.pt-header .container .pt-logo{  width: 93px; height: 16px; margin: 10px 20px 0 0;}
    .pt-header-school .container .icon-menu{ display: none; font-size: 20px; line-height: 1; margin: 10px 10px 0 0;text-decoration: none;}
    .pt-header-school.pt-header .pt-nav >ul>li>a{  line-height: 40px; padding: 0 12px; font-size: 12px;}

    .pt-header-school .pt-header-links>a{ line-height: 40px; font-size: 12px; padding: 0 6px; color: $BASEFONTCOLOR;}
    .pt-header-school .pt-header-cart{ margin-top: 8px;}
    .pt-header-school .pt-header-cart .icon{ font-size: 20px; vertical-align: middle;}
    .pt-header-school .pt-header-cart .badge{ position: relative; top: 0; right: 0;}

    @media (max-width: 360px){
      .pt-header-school .pt-header-links>a{ display: none;}
    }

    @media (max-width: 1024px){
      .pt-header .container .icon-menu{ display: inline-block;}
    }

    .pt-school-nav{ background: $BGGRAYCOLOR;}
    .pt-school-nav .container{ height: 90px; position: relative;}
    .pt-school-nav .pt-school-logo{ margin: 26px 30px 0 0}
    .pt-school-nav .pt-ul li{ display: inline-block; line-height: 90px; padding: 0 10px;}
    .pt-school-nav .pt-ul li a{ display: inline-block; text-transform: uppercase; padding: 6px 20px; border-radius:20px; line-height: 1; color: $BASEFONTCOLOR; text-decoration: none;}
    .pt-school-nav .pt-ul li a:hover{ background: #fff;}
    .pt-school-nav .pt-ul li a.on{ background: $LINKFONTCOLOR; color: #fff;}
    .pt-school-nav  .pt-school-search{ width: 20%; position: absolute; right: 15px; top: 26px;}
    .pt-school-search .icon-search{ position: absolute; right: 6px; top: 7px; line-height: 1; font-size: 20px; color: $BASEFONTCOLOR; z-index: 99; text-decoration: none;}
    .pt-school-search .form-control{ padding: 6px 30px 6px 12px;}

    @media (max-width: 1200px) {
      .pt-school-nav .pt-ul{ display: block; clear: both; text-align: center; width: 100%;background: #fff;  margin-top: 10px;  border-radius: 4px; box-shadow: 0 0 14px rgba(0,0,0,0.1)}
      .pt-school-nav .pt-ul li{  line-height: 40px; }
    }

    .pt-school-nav .icon-menu{ font-size: 24px; color: $TITLEFONTCOLOR;position: absolute; right: 15px; top: 26px;}

    @media (max-width: 768px) {
      .pt-school-nav .pt-school-logo {
        margin: 26px 0 0 0
      }
      .pt-school-nav .pt-school-logo img{ width: 180px;}
    }

    //.pt-school-banner{ background: url($IMAGES-ROOT + "temp/bg-sample-school-banner.png") no-repeat; background-size: auto 100%; height: 600px; color: #fff;}
    .pt-school-banner{ background-size: auto 100%; height: 600px; color: #fff;}
    .pt-school-banner .container{ padding-top: 130px;}
    .pt-school-banner .container h2{ font-family: Georgia; font-weight: 900;}
    .pt-school-banner .container p{ max-width: 630px; margin: 0 auto; opacity: .8; font-weight: 100;}
    .pt-school-banner .container .btn{ margin-top: 60px; min-width: 150px;}


    .pt-school-about .container,.pt-school-courses .container,.pt-school-tutors .container{ padding:70px 8px; text-align: center;}
    .pt-school-about .container p{ margin: 10px auto 20px;}
    .pt-school-about .container p.pt-school-about-desc{ text-align: left; margin: 40px auto 0;}

    .pt-school-courses,.pt-school-tutors{ background: $BGGRAYCOLOR;}
    .pt-school-courses .container{}
    .pt-school-courses-cat{ padding: 60px 8px 40px;}
    .pt-school-courses-cat a{ min-height: 183px; background: #fff; margin: 0 0 16px;  display: block; padding: 20px 0; text-align: center; text-decoration: none; color: $BASEFONTCOLOR;}
    .pt-school-courses-cat a p{ padding: 0 20px;}
    .pt-school-courses-list{ margin-bottom: 40px;}
    .pt-school-courses-list-wrap,.pt-school-tutors-wrap{ position: relative; padding:0 8px;}
    .pt-school-courses-list-wrap a.icon-left,.pt-school-courses-list-wrap a.icon-right{ font-size: 28px; text-decoration: none; position: absolute; top: 50%; margin-top: -15px;}
    .pt-school-courses-list-wrap a.icon-left{ left: -22px;}
    .pt-school-courses-list-wrap a.icon-right{ right: -22px;}

    @media (max-width: 768px) {
      .pt-school-courses-list-wrap a.icon-left,.pt-school-courses-list-wrap a.icon-right{ display: none;}
    }

    @media (min-width: 1200px){
      .col-lg-2-4{ width: 20%; float: left;}
    }

    .pt-school-tutors-wrap{ padding: 96px 0 40px;}
    .pt-school-tutor-item{ margin-bottom: 16px;font-size: 13px; text-align: center; position: relative;  background: #fff; padding-top: 50px;}

    .pt-school-tutor-item .pt-avatar-wrap{ position: absolute; top: -50px; left: 0; width: 100%;}
    .pt-school-tutor-item .pt-avatar-wrap .pt-avatar{ width: 100px; height: 100px;}
    .pt-school-tutor-item h3{ margin-bottom: 0;}

    .pt-school-tutor-item .pt-school-tutor-footer{ border-top:1px solid $BORDERCOLOR; padding: 10px 8px; margin: 40px 0 70px;}
    .pt-school-tutor-item .pt-school-tutor-footer .col-md-6{ border-right:1px solid $BORDERCOLOR; }
    .pt-school-tutor-item .pt-school-tutor-footer .col-md-6:last-child{ border-right:0; }

    .pt-school-tutors .container>.btn{ min-width: 184px; border: 0; box-shadow: 0 6px 16px #DCDFDF;}

    .pt-course-related{ background: $BGGRAYCOLOR; padding: 40px 0 80px;}
    .pt-course-related-item{ background: #fff; margin-top: 20px; border-top:3px solid $TITLEFONTCOLOR; }
    .pt-course-related-item h3{ font-size: 16px; padding: 0 16px;}
    .icon-star.on{ color:#F5A623;}
    .pt-course-related-item .pt-avatar{ width: 34px; height: 34px;}
    .pt-course-related-footer{ padding: 10px 16px; border-top: 1px solid $BORDERCOLOR; }
    .pt-course-related-footer .icon{ font-size: 22px; line-height: 1; text-decoration: none;}

    .pt-footer-prom{ padding: 80px 0;}
    .pt-footer-prom .btn{ padding: 6px 40px; }
    .pt-footer-prom h2{ margin-bottom: 4px;}
    .pt-footer-prom .col-md-6:first-child{ border-right:1px solid $BORDERCOLOR; }
    @media (max-width: 768px){
      .pt-footer-prom .col-md-6:first-child{ border: none;}
    }
  }
</style>

<script>
  import auth from '../../authenticator';

  export default {
    props:["schoolId"],
    data() {
      return {
        initialized: false,
        loading: false,
        schoolInfo: {},
        interests: [],
        courseList:[],
        teacherList:[]
      }
    },
    methods: {
      initialize() {
        this.readData();
      },
      readData() {
        let self = this;

        // School Info
        let url = GetAPIUrl() + "School/SchoolInfo?schoolID=" + this.schoolId;
        this._getData(url, null, (data) => {
          self.schoolInfo = data;
          self.schoolInfo.Slogan = self.schoolInfo.Slogan.replace(/\n/g, '<br/>');

          self.readInterest(data.Concerns);
        }, null);

        // Courses
        url = GetAPIUrl() + "Course/List?listType=1&SchoolID=" + this.schoolId + "&pageIndex=-1";
        this._getData(url, null, (data) => {
          self.courseList = data;
        }, null);

        // Teachers
        url = GetAPIUrl() + "SchoolContact/List?schoolID=" + this.schoolId + "&roleType=" + auth.SchoolRole.Teachers + "&pageIndex=-1";
        this._getData(url, null, (data) => {
          self.teacherList = data;
        }, null);
      },
      readInterest(interests) {
        let list = [];
        for (let i = 0; i < interests.length; i++) {
          let item = this.findInterest(list, interests[i].FirstID);
          if (!item) {
            item = {
              id: interests[i].FirstID,
              title: interests[i].FirstTitle,
              children: []
            };

            list.push(item);
          }

          let child = {
            id: interests[i].SecondID,
            title: interests[i].SecondTitle
          };

          item.children.push(child);
        }

        this.interests = list;
      },
      findInterest(list, id) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].id === id) {
            return list[i];
          }
        }

        return null;
      },
      _getData(url, before, success, error) {
        if (before && typeof before === 'function') {
          before();
        }

        this.loading = true;
        this.$Loading.start();

        let self = this;
        $.ajax({
          type: 'GET',
          url: url,
          beforeSend: function (request) {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function (result) {
            if (result.RetCode === 0) {
              self.loading = false;
              self.$Loading.finish();

              if (success && typeof success === 'function') {
                success(result.RetData);
              }
            }
            else { // error
              self.loading = false;
              self.$Loading.error();
              self.$Message.error({content: result.ErrorMessage,duration: 0,closable: true});
              console.log(result);

              if (error && typeof error === 'function') {
                error(result);
              }
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            self.loading = false;
            self.$Loading.error();
            self.$Message.error({content: xhr.status + ': ' + xhr.statusText,duration: 0,closable: true});
            console.log(xhr);

            if (error && typeof error === 'function') {
              error();
            }
          }
        });
      },
    }
  }
</script>
