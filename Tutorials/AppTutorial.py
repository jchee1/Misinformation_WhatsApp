import kivy
from kivy.app import App
from kivy.uix.label import Label
from kivy.uix.gridlayout import GridLayout
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.uix.widget import Widget
from kivy.properties import ObjectProperty
from kivy.uix.floatlayout import FloatLayout


class MyGrid(Widget):
    name = ObjectProperty(None)
    phone = ObjectProperty(None)

    #Button press
    def btn(self):
        print("Name: ", self.name.text, "Phone: ", self.phone.text)
        
        #reset name + phone
        self.name.text = ""
        self.phone.text = ""

class Touch(Widget):
    btn = ObjectProperty(None)

    def on_touch_down(self, touch):
        print("Mouse down", touch)
        self.btn.opacity = 0.5

    def on_touch_up(self, touch):
        print("Mouse up", touch)
        self.btn.opacity = 1

    def on_touch_move(self, touch):
        print("Mouse move", touch)


class MyMain(App): # <- Main Class
    def build(self):
        return MyGrid()
        #return FloatLayout()
        #return Touch()


if __name__ == "__main__":
    MyMain().run()