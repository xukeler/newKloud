<template>
  <div id="teacher-preview">
    <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">

    <header class="pt-header part">
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
          <div class="pt-header-search visible-lg-inline-block">
            <input type="text" placeholder="Search">
            <button type="submit"><span class="icon icon-search"></span></button>
          </div>
          <button class="hidden-lg" type="button"><span class="icon icon-search"></span></button>
          <a class="btn btn-default btn-sm" href="#" role="button">Login</a>
          <a class="btn btn-primary btn-sm" href="#" role="button">Sign Up</a>
          <div class="pt-header-cart">
            <span class="icon icon-cart"></span>
            <span class="badge">4</span>
          </div>
        </div>
      </div>
    </header>

    <section class="pt-tutor-header part">
      <div class="pt-tutor-info">
        <div class="container">
          <p class="pt-tutor-social">
            <a href="#"><img src="/static/preview/images/fb-1.svg" width="22" alt=""></a>
            <a href="#"><img src="/static/preview/images/g-1.svg"  width="22" alt=""></a>
            <a href="#"><img src="/static/preview/images/t-1.svg"  width="22" alt=""></a>
          </p>
          <div class="row">
            <div class="col-lg-9 clearfix">
              <span class="pt-avatar pull-left"><img :src="teacherInfo.AvatarUrl" alt=""></span>
              <div class="pt-tutor-info-list pull-left">
                <p>
                  <span class="text-dark text-18">{{teacherInfo.FirstName}} {{teacherInfo.MiddleName}} {{teacherInfo.LastName}}</span>
                  <span class="mar-0">
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i> 5(0)
                  </span>
                </p>
                <h3 class="text-22 text-blue">{{teacherInfo.Introduction}}</h3>
                <p class="text-12 text-dark">
                  <span><i class="icon icon-v text-green"></i> Background check passed</span>
                  <span><i class="icon icon-location "></i> <i class="text-blue">10</i> Mile from you</span>
                  <span class="mar-0"><i class="icon icon-clock "></i> 441 hours tutoring</span>
                </p>
              </div>
            </div>
            <div class="col-lg-3 pt-tutor-price-wrap">
              <div class="row text-center mar-0">
                <div class="col-md-6 col-sm-6">
                  <p class="text-red mar-0">
                    <span class="text-12">$</span><span class="text-28">129.99</span>
                  </p>
                  <p class="text-12 text-gray mar-0">per hour</p>
                </div>
                <div class="col-md-6 col-sm-6">
                  <a href="#" class="btn btn-success btn-sm">Request</a>
                </div>
              </div>
              <div class="row mar-0 pt-tutor-reply-time text-center">Replies within <b>2 hours</b></div>
            </div>
          </div>
        </div>
      </div>
      <nav class="pt-tutor-nav">
        <div class="container">
          <div class="row">
            <div class="col-lg-9">
              <ul class="pt-ul">
                <li><a href="#" class="on">Biography</a></li>
                <li><a href="#">Teaching Experience</a></li>
                <li><a href="#">Subject</a></li>
                <li><a href="#">Work Experience</a></li>
                <li><a href="#">Schedule</a></li>
                <li><a href="#">Courses Tutored</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </section>

    <section class="pt-tutor-detail part">
      <div class="container">
        <div class="row">
          <div class="col-lg-9">
            <section class="pt-tutor-team clearfix">
              <p class="pull-left mar-0">
                <i class="icon icon-medal"></i> <b class="text-dark">{{teacherInfo.FirstName}} {{teacherInfo.MiddleName}} {{teacherInfo.LastName}}</b> <span class="text-gray">is a authentication tutor of Lafayette Academy</span>
              </p>
              <p class="pull-right mar-0">
                <span><img src="/static/preview/images/temp/lafayette-academy-logo-trans.png" width="90" alt=""></span>
                <a href="#" class="text-dark">Explore school ></a>
              </p>
            </section>
            <section class="pt-tutor-bio pad-t-30">
              <h2>Biography</h2>
              <div class="row">
                <div class="col-md-6">
                  <p v-html="teacherInfo.Biography"></p>
                  <p class="text-dark"><span class="icon icon-location text-20"></span> Walnut Creek, CA 94595</p>
                </div>
                <div class="col-md-6 pt-img-auto">
                  <img src="/static/preview/images/temp/map.png" alt="">
                </div>
              </div>
            </section>
            <section class="pt-tutor-experience pad-t-30">
              <h2>Teaching Experience</h2>
              <p v-html="teacherInfo.Teaching"></p>
            </section>
            <section class="pt-tutor-subject pad-t-30">
              <h2>Subject</h2>
              <div class="pt-tutor-subject-list">
                <ul class="pt-ul">
                  <li v-for="item in interests">
                    <h3 class="text-14 text-dark">{{item.title}}</h3>
                    <p>
                      <span v-for="child in item.children">{{child.title}}; </span>
                    </p>
                  </li>
                </ul>
              </div>
            </section>
            <section class="pt-tutor-work pad-t-30">
              <h2>Work Experience</h2>
              <ul class="pt-ul pt-tutor-work-list">
                <li v-for="item in experience">
                  <span class="text-dark"><b>{{item.Place}}</b> {{item.Title}}</span>
                  <p class="text-12 text-gray">{{item.Date}}</p>
                  <p>{{item.Description}}</p>
                </li>
              </ul>
            </section>
            <section class="pt-tutor-schedule pad-t-30">
              <h2>Schedule</h2>
              <ul class="pt-ul clearfix">
                <li>
                  <p><b class="text-dark">Sun.</b></p>
                  <span>{{teacherInfo.Sunday}}</span>
                </li>
                <li>
                  <p><b class="text-dark">Mon.</b></p>
                  <span>{{teacherInfo.Monday}}</span>
                </li>
                <li>
                  <p><b class="text-dark">Tues.</b></p>
                  <span>{{teacherInfo.Tuesday}}</span>
                </li>
                <li>
                  <p><b class="text-dark">Wed.</b></p>
                  <span>{{teacherInfo.Wednesday}}</span>
                </li>
                <li>
                  <p><b class="text-dark">Thur.</b></p>
                  <span>{{teacherInfo.Thursday}}</span>
                </li>
                <li>
                  <p><b class="text-dark">Fri.</b></p>
                  <span>{{teacherInfo.Friday}}</span>
                </li>
                <li>
                  <p><b class="text-dark">Sat.</b></p>
                  <span>{{teacherInfo.Saturday}}</span>
                </li>
              </ul>
            </section>
            <section class="pt-tutor-courses pad-t-30">
              <h2>Courses Tutored</h2>
              <ul class="pt-ul">
                <li v-for="(course, $index) in courses" v-if="$index < 3" class="pt-course-public">
                  <p><img src="/static/preview/images/public-d.svg" alt=""></p>
                  <h3 class="text-16 text-dark">{{course.Title}}</h3>
                  <p class="text-12 text-blue">{{course.LessonCount}} Lesson</p>
                  <p class="text-12 text-gray">{{course.Description}}</p>
                  <div class="pt-tutor-courses-property clearfix">
                    <p><span class="text-12">Level</span><span>{{course.Level}}</span></p>
                    <p><span class="text-12">Enrolled</span><span>0 </span></p>
                    <p><span class="text-12">Language</span><span>{{course.Language}}</span></p>
                    <p><span class="text-12">Course Score</span>
                      <span>
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i>
                        5 (0)
                      </span>
                    </p>
                    <p class="pull-right"><img src="/static/preview/images/livetime.svg" alt=""></p>
                  </div>
                </li>
              </ul>
            </section>
            <section class="pt-course-review">
              <h2>Tutor Review</h2>
              <div class="row pt-course-review-sum">
                <div class="col-md-3 text-center">
                  <span class="text-36 pt-block">4.5</span>
                  <span>
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i>
                  </span>
                </div>
                <div class="col-md-2 text-center">
                  <span class="text-22 pt-block">2</span>
                  <span class="text-gray">Reviewed</span>
                </div>
                <div class="col-md-7">
                  <h4>Tags:</h4>
                  <ul>
                    <li>good communication (2)</li>
                    <li>smooth (2)</li>
                    <li>clear update (2)</li>
                    <li>helpful (2)</li>
                  </ul>
                </div>
              </div>
              <ul class="pt-course-review-list">
                <li>
                  <div class="row">
                    <div class="col-md-4">
                      <span class="pt-avatar">
                        <img src="/static/preview/images/temp/instructor-img1.png" alt="">
                      </span>
                      <div class="pt-students-info">
                        <span class="text-12 text-gray pt-block">1 days ago</span>
                        <b class="pt-students-name pt-block">Sample Student 01</b>
                        <span class="text-12 text-gray pt-block">Purchased 2 lessons</span>
                      </div>
                    </div>
                    <div class="col-md-8">
                      <span class="pt-block">
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i>
                      </span>
                      <p class="text-12">
                        Sample review content.
                      </p>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="row">
                    <div class="col-md-4">
                      <span class="pt-avatar">
                        <img src="/static/preview/images/temp/instructor-img.png" alt="">
                      </span>
                      <div class="pt-students-info">
                        <span class="text-12 text-gray pt-block">1 days ago</span>
                        <b class="pt-students-name pt-block">Sample Student 02</b>
                        <span class="text-12 text-gray pt-block">Purchased 3 lessons</span>
                      </div>
                    </div>
                    <div class="col-md-8">
                      <span class="pt-block">
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star on"></i>
                        <i class="icon icon-star"></i>
                      </span>
                      <p class="text-12">
                        Sample review content.
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </section>
          </div>
          <div class="col-lg-3">
            <section class="pt-tutor-preference">
              <h2 class="text-22">Announcement</h2>
              <p v-html="teacherInfo.Announcement"></p>
            </section>
            <section class="pt-tutor-education mar-t-16">
              <h2 class="text-22">Education</h2>
              <ul class="pt-ul">
                <li v-for="item in education">
                  <p><b>{{item.Place}}</b></p>
                  <p class="text-12">{{item.Title}}</p>
                  <p class="text-dark">{{item.Date}}</p>
                </li>
              </ul>
            </section>
            <section class="pt-tutor-qualify mar-t-16">
              <h2>Qualifications</h2>
              <ul class="pt-ul">
                <li v-for="item in qualification">
                  <p><b class="text-16 text-dark">{{item.Title}}</b></p>
                  <p>{{item.Description}}</p>
                  <p class="text-12 pt-tutor-qualify-score clearfix">
                    <span class="pull-left">{{item.Date}}</span>
                    <span class="pull-right"></span>
                  </p>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </section>

    <section class="pt-footer-prom part">
      <div class="container">
        <div class="row text-center">
          <div class="col-sm-6 col-md-6">
            <h2 class="text-18 text-dark">Learn from the Best</h2>
            <p>&nbsp;</p>
            <p><img src="/static/preview/images/from-best.jpg" width="178" alt=""></p>
            <button class="btn btn-success">Sign up now</button>
          </div>
          <div class="col-sm-6  col-md-6">
            <h2 class="text-18 text-dark">Make Money for Referring Students</h2>
            <p class="text-gray">Affiliate Marketing Opportunity</p>
            <p><img src="/static/preview/images/make-money.jpg" width="178" alt=""></p>
            <button class="btn btn-primary">Learn more</button>
          </div>
        </div>
      </div>
    </section>

    <footer class="pt-footer part">
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

  #teacher-preview {
    text-align: left;
    overflow: auto;
    font-family: 'PingFang SC',Arial,Tahoma,Helvetica,'Microsoft Yahei',sans-serif;
    color: $BASEFONTCOLOR;

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
    .pad-rl-16{ padding: 0 16px;}
    .pad-tb-16{ padding: 16px 0;}
    .pad-t-30{ padding-top: 30px;}

    .mar-0{ margin: 0 !important;}
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

    .icon-star.on{ color:#F5A623;}

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

    /*--------------------------------------tutor page style--------------------------------------*/
    .pt-tutor-info{ background: $BGLIGHTCOLOR; padding:45px 0 ;}
    .pt-tutor-info .pt-avatar{ width: 120px; height: 120px; margin:0 40px 10px 0;}
    .pt-tutor-info .container{ position: relative;}
    .pt-tutor-info .pt-tutor-info-list{ width: calc(100% - 160px)}
    .pt-tutor-info .pt-tutor-info-list h3{ margin: 0 0 20px}
    .pt-tutor-info .pt-tutor-info-list>p:first-child >span{ margin-right: 20px;}

    .pt-tutor-info .row{ position: relative;}

    .pt-tutor-info-list .text-12.text-dark .icon{ font-size: 20px; line-height: 1; vertical-align: middle;}
    .pt-tutor-info-list .text-12.text-dark >span{ display: inline-block; vertical-align: middle; margin-right: 20px;}
    .pt-tutor-social{ position: absolute; right: 15px; top: -20px; z-index: 2;}
    .pt-tutor-social a{ display: inline-block; margin-left: 6px;}

    .pt-tutor-nav{ background: darken($BGLIGHTCOLOR, 3%)}
    .pt-tutor-nav .pt-ul li{ display: inline-block;}
    .pt-tutor-nav .pt-ul li a{ display: block; padding:16px 13px; text-decoration: none;}
    .pt-tutor-nav .pt-ul li a.on{ color: $TITLEFONTCOLOR; font-weight: bold; position: relative;}
    .pt-tutor-nav .pt-ul li a.on:before{ content: ""; background: $DARKCOLOR; height: 3px; width: 100%; position: absolute; bottom: 0; left: 0;}

    .pt-tutor-price-wrap{ position: absolute; right: 0; bottom: -97px;}
    .pt-tutor-price-wrap>.row .col-md-6,.pt-tutor-price-wrap>.row{ padding-left: 0; padding-right: 0;}
    .pt-tutor-price-wrap>.row:nth-child(1){ background: #fff; padding: 20px 0;}
    .pt-tutor-price-wrap>.row >.col-md-6:nth-child(1){ border-right:1px solid $BORDERCOLOR;}
    .pt-tutor-price-wrap>.row .col-md-6:nth-child(2){ padding-top: 10px; }
    .pt-tutor-reply-time{ padding: 16px 0; background: $LINKFONTCOLOR; color: #fff;}

    @media (max-width: 1200px){
      .pt-tutor-price-wrap{ position: relative; right: 0; bottom:0; padding-top: 10px; width: 100%;}
      .pt-tutor-nav .pt-ul{ text-align: center;}

    }

    @media (max-width: 768px){

      .pt-tutor-nav .pt-ul li a.on:before{ display: none;}
      .pt-tutor-nav .pt-ul li a.on{  background: #fff; border-radius:4px; }
      .pt-tutor-nav .pt-ul{ padding:12px 0;}
      .pt-tutor-nav .pt-ul li a{ display: block; padding:6px 12px; text-decoration: none;}
      .pt-tutor-price-wrap>.row >.col-md-6:nth-child(1){ border: 0;}
    }

    @media (max-width: 414px){
      .pt-tutor-info .pt-tutor-info-list{ width: 100%;}
    }

    .pt-tutor-detail{ background: $BGGRAYCOLOR; font-size: 13px;}
    .pt-tutor-detail >.container{ padding: 56px 15px;}
    .pt-tutor-team{ background: #fff; box-shadow:0 0 6px rgba(0,0,0,0.1); padding: 8px 22px; line-height: 1;}
    .pt-tutor-team .pull-left{ padding-top: 14px;}
    .pt-tutor-team .icon-medal{ font-size: 24px; color: $HIGHLIGHTCOLOR; display: inline-block; vertical-align: middle; margin-right: 4px;}
    .pt-tutor-team .pull-right span{ display: inline-block; vertical-align: middle; margin-right: 16px;}
    .pt-tutor-subject-list{ background: #fff; padding:26px 40px; }
    .pt-tutor-subject-list>.pt-ul li{ display: inline-block; vertical-align: top; width: 48%; padding-right: 2%;}
    @media (max-width: 768px) {
      .pt-tutor-team .pull-left,.pt-tutor-team .pull-right {
        float:none !important; display: block; text-align: center;
      }
    }
    @media (max-width: 414px){
      .pt-tutor-subject-list>.pt-ul li{ display: block;  width: 100%; padding-right: 2%;}
    }

    .pt-tutor-work-list li{ margin-bottom: 30px;}
    .pt-tutor-work-list li:last-child{ margin: 0;}
    .pt-tutor-schedule>.pt-ul{ background: #fff; padding: 22px 0; }
    .pt-tutor-schedule>.pt-ul li{ float: left; width: 14.2857%; text-align: center; padding: 0 6px;}

    @media (max-width: 414px){
      .pt-tutor-schedule>.pt-ul li{ width: 50%; margin-bottom: 20px;}
    }

    .pt-tutor-courses .pt-ul li{  background: #fff; padding: 18px; border-top: 3px solid $HIGHLIGHTCOLOR; margin-bottom: 24px;}
    .pt-tutor-courses .pt-ul li:last-child{   margin-bottom: 0;}
    .pt-tutor-courses .pt-ul li.pt-course-public{ border-color: $TITLEFONTCOLOR;}
    .pt-tutor-courses-property{ position: relative;border-top:1px solid $BORDERCOLOR; padding-top: 20px; margin-top: 20px;}
    .pt-tutor-courses-property>p{ display: inline-block; padding: 0 20px; border-left:1px solid $BORDERCOLOR; }
    .pt-tutor-courses-property>p:first-child{ padding-left: 0; border: 0;}
    .pt-tutor-courses-property>p>span.text-12{ color: #999; display: block;}
    .pt-tutor-courses-property>p.pull-right{ border: 0; margin-top: 10px; padding-right: 0;}

    @media (max-width: 414px){
      .pt-tutor-courses-property>p{ display: block; width: 100%; padding:0; border-left:0 }
      .pt-tutor-courses-property>p.pull-right{ width: auto; position: absolute; top: 10px; right: 0; }
    }

    .pt-tutor-preference{ background: $DARKCOLOR; color: $WHITEFONTCOLOR; font-size: 13px; padding:26px;}
    .pt-tutor-preference h3{ font-size: 14px; color: $LINKFONTCOLOR; margin-bottom: 0;}
    .pt-tutor-preference h2{  color: $WHITEFONTCOLOR; margin-top: 0;}

    .pt-tutor-education{ background: $LINKFONTCOLOR; color: #fff; font-size: 13px; padding: 26px;}
    .pt-tutor-education h2,.pt-tutor-qualify h2{  color: #fff; margin-top: 0;}
    .pt-tutor-education .pt-ul li,.pt-tutor-qualify .pt-ul li{ margin-bottom: 20px;}
    .pt-tutor-education .pt-ul li p:first-child,.pt-tutor-qualify .pt-ul li p:first-child{ margin-bottom:0;}
    .pt-tutor-education .pt-ul li:last-child,.pt-tutor-qualify .pt-ul li:last-child{ margin-bottom: 0;}

    .pt-tutor-qualify{ background: $HIGHLIGHTCOLOR; color: #fff; font-size: 13px; padding: 26px;}
    .pt-tutor-qualify-score .pull-left{max-width: 70%;}

    .pt-course-review{ padding-top: 26px;}
    .pt-course-review-sum{ padding-bottom: 30px; border-bottom: 1px solid $BORDERCOLOR;}
    .pt-course-review-sum .text-36{ color: $TITLEFONTCOLOR;}
    .pt-course-review-sum .col-md-3,.pt-course-review-sum .col-md-2{ border-right:1px solid $BORDERCOLOR; padding-top: 20px; }

    @media (max-width: 970px){
      .pt-course-review-sum .col-md-3,.pt-course-review-sum .col-md-2{ border: none;}
    }
    .pt-course-review-sum .col-md-7{  padding-left: 30px; }
    .pt-course-review-sum h4{ font-weight: normal; font-size: 14px;}
    .pt-course-review-sum ul{ list-style: none; margin: 0; padding: 0;}
    .pt-course-review-sum li{ display: inline-block; padding: 6px 10px; border: 1px solid $BORDERCOLOR; margin:0  10px 10px 0;}
    .pt-course-review-sum.row>div{ min-height: 120px;}

    .pt-course-review-list{ list-style: none; margin: 0; padding: 0;}
    .pt-course-review-list li{ padding: 26px 0; border-bottom: 1px solid $BORDERCOLOR; }
    .pt-course-review-list li:last-child{ border-bottom:0; }
    .pt-course-review-list .pt-avatar{ width:60px; height: 60px; vertical-align: middle;}
    .pt-course-review-list .pt-students-info{ display: inline-block; margin-left: 14px; vertical-align: middle;}
    .pt-course-review-list .pt-students-info .pt-students-name{ color: $TITLEFONTCOLOR;}
  }
</style>

<script>
  import auth from '../../authenticator';

  export default {
    props:["userId"],
    data() {
      return {
        initialized: false,
        loading: false,
        teacherInfo: {},
        education: [],
        experience: [],
        qualification: [],
        interests: [],
        courses: []
      }
    },
    methods: {
      initialize() {
        this.readUser();
      },
      readUser() {
        let self = this;

        let url = GetAPIUrl() + "User/UserProfile?UserID=" + this.userId;
        this._getData(url, null, (result) => {
          self.readTeacher(result);
        }, null);
      },
      readTeacher(userInfo) {
        let self = this;

        let url = GetAPIUrl() + "User/TeacherProfile?UserID=" + this.userId;
        this._getData(url, null, (result) => {
          self.teacherInfo = userInfo;

          self.teacherInfo.Introduction = result.Introduction;
          self.teacherInfo.Biography = result.Biography.replace(/\n/g, '<br/>');
          self.teacherInfo.Teaching = result.Teaching.replace(/\n/g, '<br/>');
          self.teacherInfo.Announcement = result.Announcement.replace(/\n/g, '<br/>');

          self.readSchedule(result.Schedule);

          self.education = result.Education;
          self.experience = result.Experience;
          self.qualification = result.Qualification;

          self.readInterest(result.Concerns);

          self.readCourses();
        }, null);
      },
      readSchedule(schedule) {
        if (schedule) {
          let info = JSON.parse(schedule);
          this.teacherInfo.Sunday = (typeof info.Sunday === 'object') ? info.Sunday.join(" - ") : info.Sunday;
          this.teacherInfo.Monday = (typeof info.Monday === 'object') ? info.Monday.join(" - ") : info.Monday;
          this.teacherInfo.Tuesday = (typeof info.Tuesday === 'object') ? info.Tuesday.join(" - ") : info.Tuesday;
          this.teacherInfo.Wednesday = (typeof info.Wednesday === 'object') ? info.Wednesday.join(" - ") : info.Wednesday;
          this.teacherInfo.Thursday = (typeof info.Thursday === 'object') ? info.Thursday.join(" - ") : info.Thursday;
          this.teacherInfo.Friday = (typeof info.Friday === 'object') ? info.Friday.join(" - ") : info.Friday;
          this.teacherInfo.Saturday = (typeof info.Saturday === 'object') ? info.Saturday.join(" - ") : info.Saturday;
        }
        else {
          this.teacherInfo.Sunday = '';
          this.teacherInfo.Monday = '';
          this.teacherInfo.Tuesday = '';
          this.teacherInfo.Wednesday = '';
          this.teacherInfo.Thursday = '';
          this.teacherInfo.Friday = '';
          this.teacherInfo.Saturday = '';
        }
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
      readCourses() {
        let self = this;
        let url = GetAPIUrl() + "Course/List?listType=1&templateType=2&TeacherID=" + this.userId;
        this._getData(url, null, (result) => {
          self.courses = result;
        }, null);
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
