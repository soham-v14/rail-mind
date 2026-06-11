import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base


class Section(Base):
    __tablename__ = "sections"
    id = Column(String(20), primary_key=True)
    name = Column(String(100), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    radius = Column(Float, default=500)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc))


class Station(Base):
    __tablename__ = "stations"
    id = Column(String(20), primary_key=True)
    name = Column(String(100), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc))


class Train(Base):
    __tablename__ = "trains"
    id = Column(String(20), primary_key=True)
    name = Column(String(100), nullable=False)
    lat = Column(Float, default=0)
    lng = Column(Float, default=0)
    speed = Column(Float, default=0)
    status = Column(String(20), default="on_time")
    delay_minutes = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(String(20), primary_key=True)
    incident_type = Column(String(50), nullable=False)
    location = Column(String(200), nullable=False)
    severity = Column(String(20), nullable=False)
    description = Column(Text, default="")
    detected_objects = Column(JSON, default=list)
    risk_score = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc))
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    resolved = Column(Boolean, default=False)

    incidents = relationship("Incident", back_populates="alert")


class Incident(Base):
    __tablename__ = "incidents"
    id = Column(String(20), primary_key=True)
    alert_id = Column(String(20), ForeignKey("alerts.id", ondelete="SET NULL"), nullable=True)
    category = Column(String(100), nullable=False)
    escalation_level = Column(String(20), nullable=False)
    summary = Column(Text, nullable=False)
    actions = Column(JSON, default=list)
    stakeholders = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc))
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    resolved = Column(Boolean, default=False)

    alert = relationship("Alert", back_populates="incidents")


class RiskLog(Base):
    __tablename__ = "risk_logs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    section_id = Column(String(20), ForeignKey("sections.id", ondelete="SET NULL"), nullable=True)
    risk_score = Column(Float, nullable=False)
    risk_category = Column(String(20), nullable=False)
    top_factors = Column(JSON, default=list)
    recommendation = Column(Text, default="")
    weather_encoded = Column(Integer, default=0)
    track_condition_encoded = Column(Integer, default=0)
    crowd_density_encoded = Column(Integer, default=0)
    train_speed_kmh = Column(Float, default=0)
    is_night = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc))
