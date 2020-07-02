import kivy
from kivy.app import App
from kivy.uix.label import Label
from kivy.uix.gridlayout import GridLayout
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button 

class MyGrid(GridLayout):
    def __init__(self, **kwargs):
        super(MyGrid, self).__init__(**kwargs)
        self.cols = 1 # 1 column
        # Have 1 column as general layout but have interior layout with 2 columns inside general

        self.inside = GridLayout() #create new grid layout 
        self.inside.cols = 2 #set columns for new grid layout

        #in inside grid layout
        self.inside.add_widget(Label(text = "Name")) #add label widget
        self.name = TextInput(multiline = False) #text input box stored in name variable
        self.inside.add_widget(self.name) #add text input widget to GUI

        self.inside.add_widget(Label(text = "Phone number"))
        self.phone = TextInput(multiline = False)
        self.inside.add_widget(self.phone)
        # ---------------------------------------------

        self.add_widget(self.inside) #Add inside layout to main layout

        #Creating button
        self.submit = Button(text = "Submit", font_size = 40)
        self.submit.bind(on_press = self.pressed) #bind button so when pressed do pressed fct
        self.add_widget(self.submit)

    def pressed(self, instace):
        #get values of text inputs
        name = self.name.text 
        phone = self.phone.text

        #print values to terminal
        print("Name: ", name, "Phone: ", phone)

        #Reset text ot blank in text inputs
        self.name.text = ""
        self.phone.text = ""



class MyApp(App):
    def build(self):
        return MyGrid() #Label(text = "Hello World")

if __name__ == '__main__':
    MyApp().run()