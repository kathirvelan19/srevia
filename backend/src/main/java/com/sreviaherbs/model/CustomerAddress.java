package com.sreviaherbs.model;

public class CustomerAddress {
    private String house;
    private String street;
    private String area;
    private String city;
    private String state;
    private String pincode;

    public CustomerAddress() {}

    public CustomerAddress(String house, String street, String area, String city, String state, String pincode) {
        this.house = house;
        this.street = street;
        this.area = area;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
    }

    public String getHouse() { return house; }
    public void setHouse(String house) { this.house = house; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
}
