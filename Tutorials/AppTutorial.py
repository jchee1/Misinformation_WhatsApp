import kivy
from kivy.app import App
from kivy.uix.label import Label
from kivy.uix.gridlayout import GridLayout
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.uix.widget import Widget
from kivy.properties import ObjectProperty


class MyGrid(Widget):
    name = ObjectProperty(None)
    phone = ObjectProperty(None)

    #Button press
    def btn(self):
        print("Name: ", self.name.text, "Phone: ", self.phone.text)
        
        #reset name + phone
        self.name.text = ""
        self.phone.text = ""


class MyMain(App): # <- Main Class
    def build(self):
        return MyGrid()


if __name__ == "__main__":
    MyMain().run()