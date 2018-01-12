## 前言
为什么说是再谈呢，网上讲解这个的博客的很多，我开始学习也是看过，敲过就没了，自以为理解了就结束了，书到用时方恨少啊。实际开发中一用就打磕巴，于是在重新学习了之后分享出来。开了这么一个宏观的题目，需要做一下简单说明，这篇文章将会讲解以下几个问题：
1. 什么是面向对象编程思想，为什么要用面向对象思想。
2. js中的面向对象思想和其他静态语言相比有什么不同。
3. js中prototype，constructor，__proto__这些都是什么鬼？怎么用他们实现面向对象中的继承。
4. 一些小感悟小建议之类的吧啦吧啦。

下面我们直接开始干货。。。

## 面向对象 what's it? why ues it?

  什么是面向对象编程？当作者刚开始工作时，怀着对面向对象编程的无限敬仰和好奇，问了同事Java大牛这个问题，他的回答引我深思：不要面向对象编程，要面向工资编程。言归正传，面向对象中的对象，当然不是男女朋友的对象，ECMAScript中，对象是一个无序属性集，这里的“属性”可以是基本值、另一个对象或者函数。实际应用可以理解为一本书，一个人，一个班级，所以万物都是对象。对象的属性怎么理解，以人为例，指人的名字、身高、体重等等，对象的属性还可以是函数称之为方法，指代对象的一些操作，动作。如人的说话，走路等等。提到面向对象，那就需要提到面向过程，我们不用官方的方式来解释，从实际问题中思考。

  假设现在项目需求为画一个三角形，一个矩形。直接编写代码时，我们肯定考虑的是第一步 画三角形 第二步 画矩形。我们会编写一个三角形函数triangle() 一个矩形函数rect() 然后一步步调用，这是面向过程的思想。
```
function triangle() {...}
function rect() {...}

triangle();
rect();
```
  面向对象中我们首先会抽象问题，矩形三角形都是对象，他们的类型都是形状。他们有各自的边长顶点，那么我们会先创建一个基本对象 形状 `Shape` 属性有顶点、边长，三角形`Triangle`和矩形`Rect`都是基本对象扩展出的新对象，有各自的画图方法draw()，然后用对象得到具体的指向对象(即实例，后文解释)`triangle`调用`draw`方法

```
function Shape() {...}
function Triangle() {...}
function Rect() {...}

let triangle = new Triang();
triangle.draw();
let rect = new Rect();
rect.draw();
```
  面对一个问题，面向过程的思路是第一步做什么，第二步做什么 面向对象则需要先分析出问题中的对象都有什么，对象的属性、方法是什么，让对象要做什么。
假设现在需要获得画出矩形的边长，面向对象中只需要在`Rect`中加上一个方法就可以，面向过程则需要拿到画出的矩形，再得到边长，相比较而言面向对象易于扩展。

  面向对象中有三大特征，封装，继承，多态。封装指将变化封装起来，外面调用时不需要知道内部的实现，继承指的是一个对象可以共享父级对象的一些属性，比如上文的问题中，形状`Shape`有顶点这个属性，三角形和矩形都可以继承该属性而不需要再重新定义。多态指的是封装之后的变化如何处理，比如上文中将`draw`函数放在形状`Shape`中，内部实现就是连接点，三角形和矩形调用父级对象的`draw`，三角形与矩形的顶点不同。

  为什么要使用面向对象？面向对象因为封装，继承，多态的特征使程序更易于扩展，维护，重用。比如在另外一个环境中我们需要画三角形，我们只需要将三角形这个对象及形状父级对象引入，剩下关于三角形的操作都是三角形这个对象的内部实现。维护起来去该对象的该方法找错，比在整个环境中找三角形函数要好很多。

## js中的面向对象
  面向对象中类指的是同一类型对象的抽象，首字母大写，比如上文中的形状 `Shape` 类，三角形是通过`Shape`扩展而来，则也是一个类，`Shape`称之为它的父类，它是`Shape`的子类，同理 `Rect`也是`Shape`的一个子类。类的具体抽象称之为实例，通常为小写，创建实例的过程称之为实例化。上文中`triangle`就是一个`Triangle`三角形的实例，指具体画出的那个三角形。关于父类，子类，实例我们再用一个一个示例来展示

```
父类 Animal 
子类 Cat 实例 cat1_tom
子类 Dog 实例 dog1
```
  Animal 指所有动物，Cat 指所有猫 继承Animal 是动物的一个子类，cat1_tom 指的具体一个叫 tom 的猫。有了类我们就需要给类加一些标识，以区分类之间的区别、即属性和方法。

#### 1.走出‘类’，走进原型
  当我们弄清楚了类是什么，JavaScript没有类的概念，是通过原型来实现面向对象。在以类为中心的面向对象编程语言中，类和对象的关系可以想象成铸模和铸件的关系，对象总是从类中创建而来。而在原型编程的思想中，类并不是必需的，对象未必需要从类中创建而来，一个对象是通过克隆另外一个对象所得到的。

  从设计模式的角度讲，原型模式是用于创建对象的一种模式，如果我们想要创建一个对象，一种方法是先指定它的类型，然后通过类来创建这个对象。原型模式选择了另外一种方式，我们不再关心对象的具体类型，而是找到一个对象，然后通过克隆来创建一个一模一样的对象。而克隆出来的这个对象会记住他的原型，由谁克隆而来，同时也会共享原型的属性和方法。这样一个一个对象克隆而来，则形成了一条原型链。对上文中的例子而言，三角形的原型是形状，猫和狗的原型是动物。
#### 2.构造函数
  在java中`new Class()`new 之后跟的是一个类名，而在js中类之后跟的是一个构造函数。
```
function Shape(name) {
  this.val = 1;
  this.name = name;
  this.all = '图形';
  return this.name
}
let a = Shape('a'); // 'a'

let shape1 = new Shape('triangle'); 
let shape2 = new Shape('rect');
```
构造函数的定义与一般函数的定义相同，注意首字母大写。构造函数本质上还是一个函数，可以传参可以有返回值，只是内部使用了this变量，函数存在调用问题：
1. 直接调用：在浏览器环境中相当于在window上挂在了val这个属性，值为1。请注意这个特点，如果Shape.call(obj) 即相当于设定obj对象的val为1。
2. new 调用：生成一个实例，即生成一个新对象，这个this指向当前新生成的对象。

## constructor和prototype
这里的概念还希望大家阅读缓慢 最好能在浏览器或者node环境下敲一下理解更深。请首先一定理解何为实例何为构造函数(构造器)。他们的关系是 
__A为B的构造函数 则 B为A的一个实例__。

#### 在山的那边，海的那边，有一个prototype ，还有一个__proto__
  首先创建一个Cat的构造函数，希望say是Cat的实例共享属性，
```
function Cat(name) {
  this.name = name;
  this.say = function() {console.log(this.name)};
}

let cat1 = new Cat('tom'); 
let cat2 = new Cat('bob');
cat1.say === cat2.say // false
```
但是发现cat1 cat2的共有方法all并没有共享，每一个实例对象，都有自己的属性和方法的副本。这不仅无法做到数据共享，也是极大的资源浪费， 那么引入prototype对象：
```
function Cat(name) {
  this.name = name;
}
Cat.prototype.say = function() {
  console.log(this.name);
}
let cat1 = new Cat('tom'); 
let cat2 = new Cat('bob');
cat1.say === cat2.say 
cat1.say === Cat.prototype.say; // true
cat1.prototype; // undefined
cat1.hasOwnProperty('say');// false
```
__实例对象的constructor属性指向其构造函数(1)__，这样看起来实例对象好像“继承”了prototype对象一样。__实例没有prototype__，上文最后一行代码通过hasOwnPropertyk可以判断say这个方法并不是cat1自己的方法，__如果一个方法没有在实例对象自身找到，则向其构造函数prototype中开始寻找(2)__。

既然实例是继承自构造器的prototype，那么有没有一个属性可以直接表示对象的继承关系呢？答案是有的`__proto__`，很多浏览器都实现了这个属性，如下所示。
```
cat1.__proto__ === Cat.prototype // true
Cat.__proto__ === Function.prototype; // true
Function.prototype.__proto__ === Object.prototype; // true
```
从上我们可以发现 Cat 构造器的原型为Function.prototype ，Cat.prototype的原型为Object.prototype，所以当cat1调toString时 Cat.prototype上没有找到 就去Function.prototype上寻找，这就构成了原型链。但是对象的原型链查找和构造函数的原型查找又有一点小区别(不查Function)，构造器生成的实例对象原型链的查找过程可以如下表示：
```
cat1 
 => cat1.__proto__(Cat.prototype) 
 => cat1.__proto__.__proto__(Function.prototype) 
 => cat1.__proto__.__proto__.__proto__ (Object.prototype)
```
还有通过对象字面量创建的对象的原型链查找方式
```
let obj = {};
obj => obj.__proto__(Object.prototype) ;
```
这里根据上文__加粗(2)__的语言可以得到__Function.prototype 的构造函数是Object(3)__。关于两者的关系，我们后续继续讨论。

#### 大家都有constructor
上文的两个实例对象cat1 cat2，他们都具有一个属性constructor，指向实例的构建函数Cat，意思是他们由Cat创建而来。__实例有一个constructor属性，指向其构造函数(4)__
```
cat1.constructor === Cat; // true
cat1.constructor === Cat; // true
Cat.constructor === Function; // true
Cat.prototype.constructor === Cat; // true

Object.constructor === Function;// true
```
构造函数同样具有construtor，指向Function，Cat.prototype同样具有construtor，指向他自身，__构造函数的prototype对象的constructor指向该构造函数(5)__。

根据上文最后一行代码 可以判断Object 的构造函数 是Function。则我们可以得到Object是Function的一个实例。如下Object 与 Function的关系是
1. Object是Function的一个实例。
2. Function.prototype 是 Object 的 一个实例。

根据上文总结如下：
1. 实例对象的constructor指向其构造器。
2. 实例对象没有prototype。
3. 实例对象可以通过构造函数的prototype对象实现属性方法共享。’
4. 实例对象的`__proto__`原型指向其构造函数的prototype对象
5. 构造器的constructor指向 Function。
6. 构造函数的prototype可以挂在公共属性方法，prototype的constructor属性指向该构造函数。
7. 构造函数的`__proto__`原型指向 Function.prototype。
8. 构造函数prototype对象的`__proto__`原型指向Object.prototype。
9. 对象原型指的是对象的`__proto__`属性。


#### 继承方式的渐进式
通过上面的知识我们已经了解了原型的概念，接下来我们来一步一步实现基于原型的继承。
在继承之前，我们有必要统一一下概念及名词，
###### 实例的归实例 构造器的归构造器
```
function Animal(name) {
  let name = name; // 私有属性
  this.getName = function() { // 特权方法 也是实例方法
  	this.log(name);
    return name;
  }
  this.color = 'none'; // 实例属性
  this.say = function() { // 实例方法
    console.log(this.color);
  }
}
Animal.prototype.a = 1; // 公共属性
Animal.prototype.log = function(sth) { // 公共方法
  consoel.log(sth)
}
```
js没有严格意义的私有成员，所以对象属性都算做公开，所以我们在私有 公有上不做赘述，只是判断改属性是在实例上 还是在构造函数的prototype上。
1. 私有属性：指的是构造器内部的属性，构造器外部不可以获得，只能通过特权方法来访问。
2. 特权方法：一般称有权访问私有变量和私有函数的公有方法为特权方法，但是js没有共有方法的概念，这个方法是挂载在实例上的。
3. 实例属性(方法)：实例属性指的是挂载在实例自身的属性。
4. 公共属性(方法)：公共属性指的是挂在在构造器的prototype对象上的属性。

###### 1.  直接修改prototype
我们已经知道实例对象可以通过构造函数的prototype对象实现属性方法共享。即实例对象继承了构造器的.prototype对象，那么构造器和构造器之间的继承是不是也可以用这样的方式。
```
function Animal() {
  this.special = '猫';
};
function Cat() {}
let cat1 = new Cat();
```
如上，cat1要继承Animal的special属性，
1. 首先 cat1 作为构造器Cat 的一个实例可以继承 Cat.prototype 对象中得属性。
2. Cat.prototype 作为一个对象则应该继承 Animal.protoype.
3. Cat.prototype 应该作为构造函数Animal的一个实例。

```
function Animal() {
  this.special = '猫';
  this.arr = [2,3];
};
function Cat() {}
Cat.prototype = new Animal();
let cat1 = new Cat();
cat1.special; // '猫';

let cat2 = new Cat();
cat1.special = '狗';
cat2.special; // '猫'
cat1.special === Cat.prototype.special; // false
cat1.arr.push(1);
cat1.arr; // [2,3,1];
cat1.arr; // [2,3,1];
```
虽然我们很简单就实现了继承，但是问题一转变，就出现了bug。比如我现在希望cat1 cat2 的special 都是公共属性，arr 是实例属性。可以发现cat1操作了special 这个公共属性，cat2.special并没有改变，但是cat1.arr 改变后 cat2.arr 也改变了。其次，构造器之间的继承不能传递参数，那让我们更正2.0
###### 2. 构造函数的函数特性
```
function Animal(name) {
  this.name = name;
  this.arr = [2,3];
};
Animal.prototype.special = '猫';

function Cat(name) { 
  Animal.apply(this, arguments);
}

Cat.prototype = new Animal();

let cat1 = new Cat('tom');
let cat2 = new Cat('mary');

cat1.special = '狗'; 
cat2.special; // 猫;
cat1.hasOwnProperty('special'); // true
cat2.hasOwnProperty('special;); // false,

cat1.arr.push(1);
cat1.arr; // [2,3,1];
cat2.arr; // [2,3];

cat1.name; // 'tom'
cat2.name; // 'mary'
```
special作为公共的属性挂载在父级构造器prototype上，虽然我们修改了cat1.special cat2.special没有改变，这主要是因为cat1.special 的改变是作用在实例而不是原型上，大家可以把这个公共属性改成数组或对象 作为一个引用存储，就可以发现special是公共属性。cat1.arr的操作不影响cat2.arr的操作。而且可以实现构造器直接传参，这里实在子级构造器的内部直接调用父级构造器，构造器调用方式的区别前文也介绍过了。

看到这里，好像我们已经实现继承了，但是依然存在问题啊。代码的构建从来都是改大于写。
```
cat1.constructor; // [Function: Animal]
```
前文提到实例对象的constructor属性应该指向其构造函数，这里直接指向了父级构造器；在Cat构造器内部有一份Animal的实例属性，在Cat.prototype上同样有一份Animal的实例属性，属性重复。
###### 3. 利用空构造器过滤实例属性
```
function Animal(name) {
  this.name = name;
  this.arr = [2,3];
};
Animal.prototype.special = '猫';

function Cat(name) { 
  Animal.apply(this, arguments);
}

let F = function() {};
F.prototype = Animal.prototype;
Cat.prototype = new F();
Cat.prototype.constructor = Cat;
Cat.__proto__ = Animal.prototype;

let cat1 = new Cat('tom');
let cat2 = new Cat('mary');

cat1.constructor;
```
这里新建了一个空构造器 F() 让F.prototype = Animal.prototype，子级构造器
Cat.prototype = new F(); 这样在Cat.prototype中就没有那一份Animal实例化之后的数据。再将Cat.prototype.constructor 重新指会 构造器本身，则cat1.constructor ye的指向也没有问题了。同时修正了Cat的原型指向。

## 最后

首先感谢阅读完全文，到这里，相信基本对于原型继承实现面向对象编程没有什么问题了。之后的主要矛盾在于问题的抽象上，如何抽象合适的对象，哪些属性和方法作为公共的，哪些作为实例的，这只有日积月累的经验才能给自己最好的答案。关键还是在于理解了基础概念，多用，多练，就会发先问题。我就是自以为理解了，但是在construtor指向上老犯糊涂，还有关于Object 与 Function，多用是加深理解的最好方式了，不妨以后再解决问题是，多考虑一下面向对象。

其次，不能限定自己必须使用什么，不管是黑猫还是白猫，抓住老鼠就是好猫，代码的最终目的是为解决问题而生，同时代码是用来读的，不论是什么样的编程思路，逻辑清晰，可扩展，可复用，健壮性完好那就是好代码。

最后的最后，文中若有错误，还请及时指正。最后一个学习方法的分享，当接触一个新的知识点或者工具，1.先会用 知道这个东西是什么(what?) 怎么用(how?)， 2. 会用之后不妨了解一下原理看看内部实现（why?)，3. 等研究的比较深刻了，自然而然对在何种情况使用(where, when)。编程学习还是要带着问题去学习，有问题，才会记得更深刻，没问题的两种人，要么真的会了，要么一点都不会，再次感谢阅读~~~~