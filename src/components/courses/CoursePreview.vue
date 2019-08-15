<template>
  <div id="course-preview">
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

    <section class="pt-course-title part">
      <div class="container">
        <div class="row">
          <div class="col-sm-6">
            <ol class="breadcrumb">
              <li><a href="#">Home</a></li>
              <li><a href="#">Library</a></li>
              <li class="active">Data</li>
            </ol>
          </div>
          <div class="col-sm-6 pt-course-social">
            <a href="#"><span class="icon icon-favon"></span> <span class="text-12">Save to wish list</span></a>
            <a href="#"><img src="/static/preview/images/fb.svg" alt=""></a>
            <a href="#"><img src="/static/preview/images/g.svg" alt=""></a>
            <a href="#"><img src="/static/preview/images/t.svg" alt=""></a>
          </div>
        </div>
        <h1 class="text-center">{{course.Title}}</h1>
        <div class="pt-course-property text-center">
          <p><span class="text-12">Level</span><span>{{course.Level}}</span></p>
          <p><span class="text-12">Enrolled</span><span>0</span></p>
          <p><span class="text-12">Tutors</span><span>3</span></p>
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
        </div>
      </div>
    </section>

    <section class="pt-course-author part">
      <div class="container">
        <div class="row">
          <div class="col-md-6 col-lg-6 pad-r-30">
            <h2>About the Course Author</h2>
            <div class="pt-author-wrap">
              <div class="pt-author-header clearfix">
                <span class="pt-avatar pull-left">
                  <img :src="author.AvatarUrl" alt="">
                </span>

                <div class="pt-author-info pull-left">
                  <h3>{{author.FirstName}} {{author.MiddleName}} {{author.LastName}}</h3>
                  <p class="text-12"><span class="icon icon-location"></span> 1 Mile from you</p>
                </div>

                <div class="pt-author-key-point pull-right text-12">
                  <span>
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i>
                    <i class="icon icon-star on"></i>
                    4.5(123)
                  </span>
                  <p><span><b>123</b>Reviews</span><span><b>9</b>Courses</span></p>
                </div>
              </div>

              <div class="pt-author-des text-12">
                <p class="text-16">{{author.Introduction}}</p>

                <p v-html="author.Biography"></p>
              </div>

              <div class="pt-author-footer clearfix">
                <p class="pt-tutor-tags pull-left">
                  <span><img src="/static/preview/images/1-ON-MANY.svg" alt=""></span>
                  <span><img src="/static/preview/images/in-person.svg" alt=""></span>
                  <span><img src="/static/preview/images/online.svg" alt=""></span>
                </p>
                <p class="pull-right"><span>$</span> <span class="text-22">329.99</span> <span>/hr</span></p>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-6 pt-tutor-featured">
            <h2 class="clearfix">
              <span class="pull-left">Featured Tutors</span>
              <span class="pull-right">
                <a href="#" class="icon icon-left disable"></a>
                <a href="#" class="icon icon-right"></a>
              </span>
            </h2>
            <div class="row">
              <div class="col-sm-4">
                <div class="pt-featured-item">
                  <p class="pt-avatar-wrap">
                    <span class="pt-avatar"><img src="/static/preview/images/temp/instructor-img1.png" alt=""></span>
                  </p>
                  <h3 class="pt-ellipsis text-14">Sample tutor</h3>
                  <p>Averate Rating 4.5 (123)</p>
                  <p>1,234 hours tutoring</p>
                  <p class="pt-tutor-tags">
                    <span><img src="/static/preview/images/1-ON-1.svg" alt=""></span>
                    <span><img src="/static/preview/images/1-ON-MANY.svg" alt=""></span>
                    <span><img src="/static/preview/images/in-person.svg" alt=""></span>
                    <span><img src="/static/preview/images/online.svg" alt=""></span>
                  </p>
                  <p class="pt-tutor-price text-white"><span>$</span> <span class="text-18">123.45</span> <span>/hr</span></p>
                  <p class="pt-tutor-location text-white pt-ellipsis"><span class="icon icon-location"></span> 1 Mile from you</p>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="pt-featured-item">
                  <p class="pt-avatar-wrap">
                    <span class="pt-avatar"><img src="/static/preview/images/temp/instructor-img1.png" alt=""></span>
                  </p>
                  <h3 class="pt-ellipsis text-14">Sample tutor</h3>
                  <p>Averate Rating 4.5 (123)</p>
                  <p>1,234 hours tutoring</p>
                  <p class="pt-tutor-tags">
                    <span><img src="/static/preview/images/1-ON-1.svg" alt=""></span>
                    <span><img src="/static/preview/images/1-ON-MANY.svg" alt=""></span>
                    <span><img src="/static/preview/images/in-person.svg" alt=""></span>
                    <span><img src="/static/preview/images/online.svg" alt=""></span>
                  </p>
                  <p class="pt-tutor-price text-white"><span>$</span> <span class="text-18">123.45</span> <span>/hr</span></p>
                  <p class="pt-tutor-location text-white pt-ellipsis"><span class="icon icon-location"></span> 1 Mile from you</p>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="pt-featured-item">
                  <p class="pt-avatar-wrap">
                    <span class="pt-avatar"><img src="/static/preview/images/temp/instructor-img1.png" alt=""></span>
                  </p>
                  <h3 class="pt-ellipsis text-14">Sample tutor</h3>
                  <p>Averate Rating 4.5 (123)</p>
                  <p>1,234 hours tutoring</p>
                  <p class="pt-tutor-tags">
                    <span><img src="/static/preview/images/1-ON-1.svg" alt=""></span>
                    <span><img src="/static/preview/images/1-ON-MANY.svg" alt=""></span>
                    <span><img src="/static/preview/images/in-person.svg" alt=""></span>
                    <span><img src="/static/preview/images/online.svg" alt=""></span>
                  </p>
                  <p class="pt-tutor-price text-white"><span>$</span> <span class="text-18">123.45</span> <span>/hr</span></p>
                  <p class="pt-tutor-location text-white pt-ellipsis"><span class="icon icon-location"></span> 1 Mile from you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="pt-course-detail part">
      <div class="container">
        <div class="row">
          <div class="col-md-9">
            <section class="pt-detail-des">
              <h2>Description</h2>
              <div v-html="course.Description">
              </div>
            </section>
            <!--<section class="pt-detail-learn">
              <h2>You will learn about</h2>
              <ul class="clearfix">
                <li>Learn to use Python professionally, learning both Python 2 and Python 3!</li>
                <li>Create games with Python, like Tic Tac Toe and Blackjack!</li>
                <li>Learn advanced Python features, like the collections module and how to work with timestamps!</li>
                <li>Learn to use Object Oriented Programming with classes!</li>
                <li>Understand complex topics, like decorators.</li>
                <li>Understand how to use both the Jupyter Notebook and create .py files</li>
              </ul>
            </section>
            <section class="pt-detail-des">
              <h2>Description</h2>
              <p>Become a Python Programmer and learn one of employer's most request skills of 2017!

              <p>This is the most comprehensive, yet straight-forward, course for the Python programming language on Udemy! Whether you have never programmed before, already know basic syntax, or want to learn about the advanced features of Python, this course is for you! In this course we will teach you Python 3. (Note, we also provide older Python 2 notes in case you need them)</p>

              <p>With over 100 lectures and more than 10 hours of video this comprehensive course leaves no stone unturned! This course includes quizzes, tests, and homework assignments as well as 3 major projects to create a Python project portfolio!</p>

              <p>This course will teach you Python in a practical manner, with every lecture comes a full coding screencast and a corresponding code notebook! Learn in whatever manner is best for you!</p>

              <p>We will start by helping you get Python installed on your computer, regardless of your operating system, whether its Linux, MacOS, or Windows, we've got you covered!
              </p>
            </section>-->

            <section class="pt-detail-curriculum">
              <h2>Lectures</h2>

              <div class="pt-detail-chapter" v-for="(lecture, $index) in lectures">
                <h3><span>{{$index + 1}}</span>{{lecture.Title}}</h3>
                <ul>
                  <li>
                    {{lecture.Description}}
                  </li>
                </ul>
              </div>
            </section>

            <section class="pt-detail-curriculum">
              <h2>Assignments</h2>

              <div class="pt-detail-chapter" v-for="(assignment, $index) in assignments">
                <h3><span>{{$index + 1}}</span>{{assignment.Title}}</h3>
                <ul>
                  <li>
                    {{assignment.Description}}
                  </li>
                </ul>
              </div>
            </section>

            <section class="pt-course-review">
              <h2>Course Review</h2>
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
                        <span class="text-12 text-gray pt-block">Purchased 3 lessons</span>
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
                        Sample review
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
                        Sample review
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </section>

          </div>

          <div class="col-md-3">
            <aside class="pt-recorded-lessons">
              <h3>Recorded Sample Lessons</h3>
              <ul>
                <li v-for="(samplevideo, $index) in samplevideos">
                  <p class="text-12 text-gray">{{samplevideo.Title}}</p>
                  <h4 class="text-14 text-dark">{{samplevideo.Description}}</h4>
                  <p class="pt-img-auto">
                    <a href="javascript:void(null);" @click="handleClickVideo(samplevideo)">
                      <img src="/static/preview/images/temp/sample.png" alt="">
                    </a>
                  </p>

                  <div class="clearfix">
                    <p class="pull-left pt-ellipsis">
                      <span class="pt-avatar"><img src="/static/preview/images/temp/instructor-img1.png" alt=""> </span>
                      <span class="text-12">Aaron Johnson Aaron JohnsonAaron JohnsonAaron Johnson</span>
                    </p>
                    <p class="pull-right text-dark">
                      <span class="icon icon-clock"></span> <span class="text-12">10:04</span>
                    </p>
                  </div>
                </li>
              </ul>
            </aside>
            <aside class="pt-available-tutors">
              <h3>Available Tutors</h3>
              <ul>
                <li>
                  <div class="pt-available-tutors-header">
                    <span class="pt-avatar"><img src="/static/preview/images/temp/instructor-img1.png" alt=""></span>
                    <div>
                      <p class="text-dark"><b>Sample Tutor</b></p>
                      <p class="text-12">Averate Rating 4.5 (123)</p>
                      <p class="text-12 text-gray">1,234 hours tutoring</p>
                    </div>
                  </div>
                  <p class="text-12 text-gray">Sample Tutor</p>
                  <p>
                    <img src="/static/preview/images/1-ON-1.svg" alt="">
                    <img src="/static/preview/images/in-person-d.svg" alt="">
                    <img src="/static/preview/images/online-d.svg" alt="">
                  </p>
                  <p class="text-12 text-blue"><span>$</span> <span class="text-18">123.45</span> <span>/hr</span></p>
                  <p class="text-12 text-dark"><span class="icon icon-location"></span> <span>1 Mile from you</span></p>
                </li>
                <li>
                  <div class="pt-available-tutors-header">
                    <span class="pt-avatar"><img src="/static/preview/images/temp/instructor-img1.png" alt=""></span>
                    <div>
                      <p class="text-dark"><b>Sample Tutor</b></p>
                      <p class="text-12">Averate Rating 4.5 (123)</p>
                      <p class="text-12 text-gray">1,234 hours tutoring</p>
                    </div>
                  </div>
                  <p class="text-12 text-gray">Sample Tutor</p>
                  <p>
                    <img src="/static/preview/images/1-ON-1.svg" alt="">
                    <img src="/static/preview/images/in-person-d.svg" alt="">
                    <img src="/static/preview/images/online-d.svg" alt="">
                  </p>
                  <p class="text-12 text-blue"><span>$</span> <span class="text-18">123.45</span> <span>/hr</span></p>
                  <p class="text-12 text-dark"><span class="icon icon-location"></span> <span>1 Mile from you</span></p>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </section>

    <section class="pt-course-related part">
      <div class="container">
        <h2 class="text-18 text-dark">Related Courses</h2>
        <div class="row">
          <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="pt-course-related-item">
              <h3 class="text-dark">Sample related courses</h3>
              <div class="pad-rl-16">
                <p class="clearfix text-12 text-gray">
                    <span class="pull-left">
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      5(0)
                    </span>
                  <span class="pull-right">1 Lesson</span>
                </p>
                <p class="clearfix text-12 ">
                  <span class="text-blue pull-left">High level</span>
                  <span class="text-gray pull-right">0 Enrolled</span>
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
          <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="pt-course-related-item">
              <h3 class="text-dark">Sample related courses</h3>
              <div class="pad-rl-16">
                <p class="clearfix text-12 text-gray">
                    <span class="pull-left">
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      5(0)
                    </span>
                  <span class="pull-right">1 Lesson</span>
                </p>
                <p class="clearfix text-12 ">
                  <span class="text-blue pull-left">High level</span>
                  <span class="text-gray pull-right">0 Enrolled</span>
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
          <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="pt-course-related-item">
              <h3 class="text-dark">Sample related courses</h3>
              <div class="pad-rl-16">
                <p class="clearfix text-12 text-gray">
                    <span class="pull-left">
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      5(0)
                    </span>
                  <span class="pull-right">1 Lesson</span>
                </p>
                <p class="clearfix text-12 ">
                  <span class="text-blue pull-left">High level</span>
                  <span class="text-gray pull-right">0 Enrolled</span>
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
          <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="pt-course-related-item">
              <h3 class="text-dark">Sample related courses</h3>
              <div class="pad-rl-16">
                <p class="clearfix text-12 text-gray">
                    <span class="pull-left">
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      <i class="icon icon-star on"></i>
                      5(0)
                    </span>
                  <span class="pull-right">1 Lesson</span>
                </p>
                <p class="clearfix text-12 ">
                  <span class="text-blue pull-left">High level</span>
                  <span class="text-gray pull-right">0 Enrolled</span>
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

    <div>
      <Modal v-model="modalVideo" class-name="course-preview-video" title="Recorded Sample" :mask-closable="true" width="800" @on-visible-change="handleModalVideo">
        <!-- 560 X 315 -->
        <iframe width="768" height="432" :src="videoLink" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        <div slot="footer">
        </div>
      </Modal>
    </div>
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

  $GRAYCOLOR: #F8F8F8;
  $REDCOLOR: #D0021B;
  $WHITEFONTCOLOR:#D2D6DE;

  #course-preview {
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

    /*course preview style*/
    .pt-course-title{ background: $TITLEFONTCOLOR; color: $WHITEFONTCOLOR}
    .pt-course-title .breadcrumb{ background: transparent; font-size: 12px; margin: 0; padding:20px 0; }
    .pt-course-title .breadcrumb a{ background: transparent; color: $WHITEFONTCOLOR }
    .pt-course-title .breadcrumb .active{ color: fade($WHITEFONTCOLOR, 60%) }

    .pt-course-social{ text-align: right; padding-top: 16px;}
    @media (max-width: 768px){
      .pt-course-social{ text-align: center;}
    }

    .pt-course-social a{ color: fade($WHITEFONTCOLOR, 70%); display: inline-block; text-decoration: none; vertical-align: middle; margin-left: 8px;}
    .pt-course-social a .icon-favon{ display: inline-block; vertical-align: middle; color: $HIGHLIGHTCOLOR;}
    .pt-course-social a:first-child{ margin-right: 8px;}

    .pt-course-title .container h1{ font-size: 30px; font-family: "Arial Black"; color: #fff; margin-top: 40px;}
    .pt-course-property{ padding: 20px 0 40px;}
    .pt-course-property p{ display: inline-block; line-height: 1.3; text-align: left; padding: 0 30px; border-right:1px solid rgba(255,255,255,0.4) }
    .pt-course-property p:last-child{ border-right:0; }
    .pt-course-property p span:last-child{ color: #fff;}
    .pt-course-property p span .icon-star{ font-size: 14px; line-height: 1;}
    .pt-course-property p span .icon-star.on{ color: #F5A623;}
    .pt-course-property .text-12{ display: block;}

    .pt-course-author{ background: $DARKCOLOR; color: $WHITEFONTCOLOR; padding: 40px 0 60px;}
    .pt-course-author h2{ font-size: 18px; color: #fff; font-weight: normal; margin-bottom: 40px;}
    .pt-author-header{ padding-bottom: 20px;}
    .pt-author-header .pt-avatar{ width: 66px; height: 66px; margin-right: 16px;}
    .pt-author-info h3{ margin: 6px 0 10px; font-size: 15px; color: #fff;}

    .pt-author-des{ opacity: .7;}

    .pt-author-key-point>span:first-child{ display: block;}
    .pt-author-key-point>span:first-child .icon.on{ color: #F5A623;}
    .pt-author-key-point>span:first-child .icon{ font-size: 14px; line-height: 1;}
    .pt-author-key-point>p>span{ display: inline-block; vertical-align: middle; margin-left: 14px; text-align: right;}
    .pt-author-key-point>p>span>b{ color: $HIGHLIGHTCOLOR; font-weight: bold; font-size: 14px; display: block;}
    .pt-author-wrap .pt-author-des{ height: 184px;  overflow: hidden;}
    .pt-author-footer{ padding-top: 20px;}

    .pt-tutor-featured h2 a{ text-decoration: none; color: #fff; font-size: 20px;}
    .pt-tutor-featured h2 a.disable{ opacity: .5; cursor: default;}
    .pt-tutor-featured .pt-featured-item{ position: relative; min-height: 324px; background: $TITLEFONTCOLOR;text-align: center; border-radius:4px;  padding: 40px 10px 14px; font-size: 12px;}
    .pt-tutor-featured .pt-featured-item .pt-avatar-wrap{ position: absolute; top: -26px; left: 0; width: 100%;}
    .pt-featured-item .pt-avatar{ width: 52px; height: 52px;}
    .pt-featured-item h3{ margin: 0; color: #fff;}
    .pt-featured-item  .pt-tutor-tags{ line-height: 2;}
    .pt-featured-item .pt-tutor-price{ position: absolute; bottom: 50px; left: 0; width: 100%;}
    .pt-featured-item .pt-tutor-location{ position: absolute; bottom: 10px; left: 0; width: 100%;}

    @media (max-width: 768px){
      .pt-tutor-featured .pt-featured-item{ margin-bottom: 40px; min-height: auto; padding-bottom: 100px;}
    }

    .pt-course-detail{ padding: 40px 0 60px; font-size: 13px; background-color: white;}
    .pt-course-detail h2{ font-size: 20px; color: $TITLEFONTCOLOR; font-weight: normal; margin-bottom: 24px;}
    .pt-course-detail .pt-detail-learn ul{list-style: none; margin: 0; padding: 0;}
    .pt-course-detail .pt-detail-learn li{ display: inline-block; vertical-align: top; width: 48%; background: url($IMAGES-ROOT + "check.svg") no-repeat 0 2px;
      background-size: 18px auto; padding:0 20px 0 30px; margin-bottom: 30px;}

    .pt-detail-curriculum{ padding-top: 26px;}
    .pt-detail-curriculum .pt-detail-chapter h3{ color: #999; text-transform: uppercase; font-size: 15px; font-weight: normal; margin: 30px 0 4px;}
    .pt-detail-curriculum .pt-detail-chapter h3>span{ padding-right: 20px;}
    .pt-detail-curriculum .pt-detail-chapter ul{ list-style: none; margin: 0; padding: 0;}
    .pt-detail-curriculum .pt-detail-chapter li{ padding: 6px 0; border-bottom: 1px solid $BORDERCOLOR; margin-bottom: 10px;}
    .pt-detail-chapter li>span:first-child{ padding-right: 16px;}

    .pt-course-review{ padding-top: 26px;}
    .pt-course-review-sum{ padding-bottom: 30px; border-bottom: 1px solid $BORDERCOLOR;}
    .pt-course-review-sum .text-36{ color: $TITLEFONTCOLOR;}
    .pt-course-review-sum .icon-star.on{ color:#F5A623;}
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
    .pt-course-review-list .col-md-8 .icon-star.on{ color:#F5A623;}

    .pt-course-detail .col-md-3 aside{ background: #f8f8f8; padding: 0 24px; margin-bottom: 20px;}
    .pt-course-detail .col-md-3 h3{ color: $TITLEFONTCOLOR; font-size: 16px; margin: 0 0 16px; padding: 20px 0; border-bottom: 1px solid $BORDERCOLOR;}
    .pt-recorded-lessons>ul,.pt-available-tutors>ul{ list-style: none; margin: 0; padding: 0;}
    .pt-recorded-lessons li,.pt-available-tutors li{ padding:0 0 14px; margin-bottom: 16px; border-bottom: 1px solid $BORDERCOLOR;}
    .pt-recorded-lessons li:last-child,.pt-available-tutors li:last-child{ border-bottom: 0; margin-bottom: 0;}
    .pt-recorded-lessons li .pt-avatar{ width: 30px; height: 30px; vertical-align: middle;}
    .pt-recorded-lessons li .clearfix .pull-right{ padding-top: 8px;}
    .pt-recorded-lessons li .clearfix .pull-right>span{ vertical-align: middle; display: inline-block;}
    .pt-recorded-lessons li .clearfix .pull-left{ max-width: 70%;}

    .pt-available-tutors .pt-available-tutors-header .pt-avatar{ width:52px; height: 52px; vertical-align: middle; margin-right: 10px; }
    .pt-available-tutors .pt-available-tutors-header{ padding-bottom: 16px;}
    .pt-available-tutors .pt-available-tutors-header >div{ display: inline-block; vertical-align: middle;}
    .pt-available-tutors .pt-available-tutors-header >div p{ margin: 0;}

    .pt-course-related{ background: $GRAYCOLOR; padding: 40px 0 80px;}
    .pt-course-related-item{ background: #fff; margin-top: 20px; border-top:3px solid $TITLEFONTCOLOR; }
    .pt-course-related-item h3{ font-size: 16px; padding: 0 16px;}
    .pt-course-related-item .icon-star.on{ color:#F5A623;}
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

  .course-preview-video{
    .ivu-modal-footer {
      display: none;
    }
  }
</style>

<script>
  import auth from '../../authenticator';

  export default {
    props:["courseId"],
    data() {
      return {
        initialized: false,
        loading: false,
        course: {},
        lectures: [],
        assignments: [],
        samplevideos: [],
        modalVideo: false,
        videoLink: '',
        author: {}
      };
    },
    methods: {
      initialize() {
        this.readData();
      },
      readData() {
        let self = this;
        let url = GetAPIUrl() + "Course/FullItem?courseID=" + this.courseId;

        this._getData(url, null, (data) => {
          self.course = data.CourseInfo;
          self.lectures = data.LectureList;
          self.assignments = data.AssignmentList;
          self.samplevideos = data.SampleVideoList;

          self.readAuthor(data.CourseInfo.TeacherID);
        }, null);
      },
      readAuthor(userId) {
        if (userId <= 0) {
          self.author = {};
          return
        }

        let self = this;

        let url = GetAPIUrl() + "User/UserProfile?UserID=" + userId;
        this._getData(url, null, (result) => {
          self.readTeacher(userId, result);
        }, null);
      },
      readTeacher(userId, userInfo) {
        let self = this;

        let url = GetAPIUrl() + "User/TeacherProfile?UserID=" + userId;
        this._getData(url, null, (result) => {
          self.author = userInfo;

          self.author.Introduction = result.Introduction;
          self.author.Biography = result.Biography.replace(/\n/g, '<br/>');
          self.author.Teaching = result.Teaching.replace(/\n/g, '<br/>');
          self.author.Announcement = result.Announcement.replace(/\n/g, '<br/>');
        }, null);
      },
      handleClickVideo(samplevideo) {
        if (samplevideo) {
          if (samplevideo.TypeID === 1) {
            this.videoLink = samplevideo.Link1;
            this.modalVideo = true;
          }
        }
      },
      handleModalVideo(show) {
        if (!show) {
          this.videoLink = '';
        }
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
              self.$Message.error(result.ErrorMessage);
              console.log(result);

              if (error && typeof error === 'function') {
                error(result);
              }
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(xhr.status + ': ' + xhr.statusText);
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
