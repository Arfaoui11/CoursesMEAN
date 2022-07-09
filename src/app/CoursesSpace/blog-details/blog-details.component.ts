import {Component, ElementRef, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PostComment} from "../../core/model/PostComment";
import {Formation} from "../../core/model/Formation";
import {User} from "../../core/model/User";
import {FormationService} from "../services/formation.service";
import {DomSanitizer} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {TokenService} from "../services/token.service";
import {Quiz} from "../../core/model/Quiz";
import {AppService} from "../services/app.service";

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {

  public comment: Record<string, any>[];

  public listComment: Record<string, any>[];

  @Input() post : PostComment = new PostComment;

  @ViewChild('thenfirst', {static: true}) thenfirst: TemplateRef<any>|null = null;
  @ViewChild('thenSec', {static: true}) thenSec: TemplateRef<any>|null = null;

  rating: number;
  retrieveResonse : any;
  activeIndex = 0;
  index : number =0;
  public show : boolean = false ;
  day :Date = new Date();
  dataa :any;
  showC : boolean = false;
  videoUrl: any;
  public idFormation :string;
  toggle: boolean = true;
  formation : Formation;
  currentUser: User;
  ListQuiz : any[]=[];
  quiz :Quiz;

  public img: any;
  public pressure: any;
  public wind: any;
  public desc: any;
  public humidite: any;
  public lieu: any;
  public drizzle: any;
  public lat: any;
  public lot: any;
  public temp : any;

  public formateur :User;
  public retrieveFiles: any[]=[];
  public retrieveVideo: any[]=[];
  public retrieveImage: any[]=[];
  public go: boolean =false;
  public isTested: boolean =false;
  public listFormation: Formation;

  public nbrQuiztoCertifcate: number = 5;
  private counter: number=0;
  private users: User[]=[];
  public user: User;
  public listQuizTested: any[]=[];



  constructor(private serviceForm : FormationService,private appService: AppService,private sanitizer : DomSanitizer,private snackbar:MatSnackBar ,private http: HttpClient, private route:ActivatedRoute,private token: TokenService) {
    this.currentUser = this.token.getUser();
    this.getUserTested();




  }

  ngOnInit(): void {

    this.idFormation = this.route.snapshot.params['idCourses'];

   if (this.currentUser)
    this.getLsitQuizTestByUser();


    this.getFormation();
    if (this.currentUser)
    this.getLsitQuizTestByUser();
    setTimeout( () => {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.formation.lieu}&units=metric&appid=50a7aa80fa492fa92e874d23ad061374`)
        .then(response => response.json())
        .then(data => {
          var tempValue = data['main']['temp'];
          var drizzle = data['weather'][0]['main'];

          var name = data['name'];
          var pressure = data['main']['pressure'];
          var humidity = data['main']['humidity'];
          var descValue = data['weather'][0]['description'];
          var wind = data['wind']['speed'];
          this.img = data['weather'][0]['icon'];
          var lat = data['coord']['lat'];
          var lot = data['coord']['lon'];


          this.lat = lat;
          this.lot = lot;

          this.drizzle = drizzle;
          this.lieu = name;
          this.wind = wind;
          this.pressure += pressure;
          this.humidite = humidity;
          this.temp = tempValue.toFixed(1);

          this.desc = descValue;


        });
    },1000);





    setTimeout( () => {

      this.getCommentByFormation();


      this.rating = this.formation.ratings;
    },2000);

    console.log(this.comment)

    this.serviceForm.getFormationById(this.idFormation)
     .subscribe(
     data=> {

       this.listFormation =data;

      for (let l of this.listFormation.images)
      {


        if(l.toString().includes('mp4') || l.toString().includes('mkv') || l.toString().includes('wmv'))
        {
          this.retrieveVideo.push(l)  ;
          console.log(this.retrieveVideo[this.index]);
        }else if(l.toString().includes('word') || l.toString().includes('pdf'))
        {
          this.retrieveFiles.push(l);
        }
        else if (l.toString().includes('jpg') || l.toString().includes('png') || l.toString().includes('jpeg'))
        {
          this.retrieveImage.push(l) ;
        }


      }

    }
    );


  }

  getUserTested() {

    this.appService.listUser().subscribe(response => {
      this.users = response;
      for (let u of this.users)
      {
        if (u.id == this.currentUser.id)
        {
          this.user = u;
        }
      }
    });
  }

  getLsitQuizTestByUser()
  {

    this.serviceForm.getListQuizByUser(this.currentUser.id,this.idFormation).subscribe((data) =>
    {
      this.listQuizTested = data;
    })
  }





  getFormation()
  {
    this.serviceForm.getFormationById(this.idFormation).subscribe(data => {
      this.formation = data;



    for (let app of this.formation.courseApprenants)
    {
      if (app.userA.id == this.currentUser.id)
      {
        this.show = true;
      }
    }
    if (this.formation.quizzes.length >0 )
    {
      this.nbrQuiztoCertifcate =   ( this.listQuizTested.length);
    }





    for (let q of this.listQuizTested)
    {
      let createAt = new Date(q.createAt);
      let today = new Date(Date.parse(Date()));
      if (createAt < today )
      {
        this.quiz =q;
        this.go = true;
      }
    }


      this.rating = this.formation.ratings;



    });
    return this.formation;
  }

  public status: number;

  sendComments()
  {
    this.serviceForm.writeComment(this.post,this.idFormation,this.currentUser.id).subscribe(
      data=>{
        this.getFormation();


      },

    );
  }

  getCommentByFormation()
  {




    this.serviceForm.getCommentByFormation(this.idFormation).subscribe(
      (data: PostComment[]) => {
        this.comment = data;
        for (let l of this.comment) {
          let xx = new XMLHttpRequest();
          let xmll = new XMLHttpRequest();

          let nbL=0;
          let nbD=0;
          xmll.onreadystatechange = ()=>
          {
            l.nbrDisLikes = JSON.parse(xmll.responseText)
          };
          xx.onreadystatechange = ()=>
          {
            l.nbrLikes = JSON.parse(xx.responseText)
          };

          xx.open('get','http://localhost:8099/Courses/getNbrLikesByComment/'+l.idComn,true);


          xx.send(null);


          xmll.open('get','http://localhost:8099/Courses/getNbrDislikesByComment/'+l.idComn,true);


          xmll.send(null);

        }

      }
    );
    return this.comment;
  }
  public stat : boolean = true;

  LikesComment(id:string)
  {
    let status = true;
    for (let c of this.formation.comments)
    {
      if (c.id == id)
      {
        for (let l of c.likes)
        {

          if(l.user.id == this.currentUser.id)
          {
            status=false;
          }

        }

      }

    }


      if (status) {
        this.serviceForm.addLikes(id, this.currentUser.id).subscribe(data => {
            console.log(data);


            this.getFormation();

          }
        );
      }


  }


  public nbrL : number=0;
  public nbrD:number=0;


private ratTrue = false;

  changeRating() {

    if (!this.ratTrue)
    {
      this.serviceForm.addRatingFormation(this.idFormation,this.rating).subscribe(
        data => {


          setTimeout(()=>
          {

            this.getFormation()

          },500);

        }
      );
      this.ratTrue= true;
    }


  }

  DisLikesComment(id:string)
  {

    let status = true;
    for (let c of this.formation.comments)
    {
      if (c.id == id)
      {
        for (let l of c.dislikes)
        {

          if(l.user.id == this.currentUser.id)
          {
            status=false;
          }

        }

      }

    }
    if (status) {
      this.serviceForm.addDisLikes(id, this.currentUser.id).subscribe(data => {
        this.getFormation();
      });
    }
  }





  playvideo( s :string) {
    this.serviceForm.DownloadFile(s).subscribe(
      x=>
      {
        const blob = new Blob([x],{type : 'video/mp4'})

        if(window.navigator && window.navigator.msSaveOrOpenBlob)
        {
          window.navigator.msSaveOrOpenBlob(blob);
          return;
        }

        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;

        link.dispatchEvent( new MouseEvent('click',{bubbles:true,cancelable:true,view:window}))

        setTimeout(function () {
          window.URL.revokeObjectURL(data);
          link.remove();
        },1000)

      }
    )

  }

  downloadFiles( s :string) {
    this.serviceForm.DownloadFile(s).subscribe(
      x=>
      {
        const blob = new Blob([x],{type : 'video/mp4'});

        if(window.navigator && window.navigator.msSaveOrOpenBlob)
        {
          window.navigator.msSaveOrOpenBlob(blob);
          return;
        }

        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = "video.mp4";

        link.dispatchEvent( new MouseEvent('click',{bubbles:true,cancelable:true,view:window}))

        setTimeout(function () {
          window.URL.revokeObjectURL(data);
          link.remove();
        },1000)

      }
    )

  }
  videoPlayerInit(data:any) {
    this.dataa = data;

    this.dataa.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.initVdo.bind(this));
    this.dataa.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
  }
  initVdo() {
    this.dataa.play();
  }

  nextVideo() {
    this.index++;

    if (this.index === this.retrieveResonse.length) {
      this.activeIndex = 0;
    }

    this.retrieveVideo = this.retrieveVideo[this.index];
  }

  sendIndex($index: number) {
    this.index =$index;
    this.retrieveVideo[this.index].play();
  }

  assingAppToCourses() {
    this.serviceForm.affectationApptoFormation(this.currentUser.id,this.idFormation).subscribe(
      (data) => {console.log(data);
        this.snackbar.open(' This Courses Add To Yours List ', 'Undo', {
          duration: 2000
        });
        this.show = true;
      }
    )
  }

  gotTo404() {
    if (this.currentUser)
    {
      window.location.href = '/front/End/myCalender'
    }else
    {

      this.snackbar.open(' Go to Register An Account  ', 'Undo', {
        duration: 2000
      });
      setTimeout(()=> {
        window.location.href = '#/front/End/asd';
      },2000 );

    }
    return false;
  }
}
